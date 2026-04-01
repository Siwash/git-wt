import { TextPrompt, isCancel } from '@clack/core';
import { select, multiselect } from '@clack/prompts';
import pc from 'picocolors';
import process from 'node:process';

// ── Unicode detection (matching @clack/prompts) ──────────────

function isUnicodeSupported(): boolean {
  if (process.platform !== 'win32') return process.env.TERM !== 'linux';
  return !!(
    process.env.CI ||
    process.env.WT_SESSION ||
    process.env.TERMINUS_SUBLIME ||
    process.env.ConEmuTask === '{cmd::Cmder}' ||
    process.env.TERM_PROGRAM === 'Terminus-Sublime' ||
    process.env.TERM_PROGRAM === 'vscode' ||
    process.env.TERM === 'xterm-256color' ||
    process.env.TERM === 'alacritty' ||
    process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
  );
}

const u = isUnicodeSupported();
const S_ACTIVE = u ? '◆' : '*';
const S_CANCEL = u ? '■' : 'x';
const S_ERROR = u ? '▲' : 'x';
const S_SUBMIT = u ? '◇' : 'o';
const S_BAR = u ? '│' : '|';
const S_BAR_END = u ? '└' : '—';
const S_RADIO_ON = u ? '●' : '>';
const S_RADIO_OFF = u ? '○' : ' ';
const S_CHECK_ON = u ? '◼' : '[+]';
const S_CHECK_OFF = u ? '◻' : '[ ]';

function sym(state: string): string {
  switch (state) {
    case 'initial':
    case 'active':
      return pc.cyan(S_ACTIVE);
    case 'cancel':
      return pc.red(S_CANCEL);
    case 'error':
      return pc.yellow(S_ERROR);
    case 'submit':
      return pc.green(S_SUBMIT);
    default:
      return pc.cyan(S_ACTIVE);
  }
}

// ── Types ────────────────────────────────────────────────────

export interface SearchOption<T> {
  value: T;
  label: string;
  hint?: string;
}

// ── Filter helper ────────────────────────────────────────────

function filterOpts<T>(options: SearchOption<T>[], keyword: string): SearchOption<T>[] {
  if (!keyword) return options;
  const kw = keyword.toLowerCase();
  return options.filter(
    o => o.label.toLowerCase().includes(kw) || o.hint?.toLowerCase().includes(kw),
  );
}

// ── Scrolling window (matching @clack/prompts algorithm) ─────

function scrollWindow<T>(
  options: SearchOption<T>[],
  cursor: number,
  renderItem: (opt: SearchOption<T>, active: boolean) => string,
): string[] {
  if (options.length === 0) return [];

  // Reserve lines for: connecting bar, symbol+message, search input, count line, bar-end
  const maxVisible = Math.min(Math.max(process.stdout.rows - 7, 0), 15);
  if (maxVisible <= 0) return [];

  let start = 0;
  if (options.length > maxVisible) {
    if (cursor >= start + maxVisible - 3) {
      start = Math.max(Math.min(cursor - maxVisible + 3, options.length - maxVisible), 0);
    } else if (cursor < start + 2) {
      start = Math.max(cursor - 2, 0);
    }
  }

  const hasAbove = options.length > maxVisible && start > 0;
  const hasBelow = options.length > maxVisible && start + maxVisible < options.length;
  const visible = options.slice(start, start + maxVisible);

  return visible.map((opt, i) => {
    if (i === 0 && hasAbove) return pc.dim('...');
    if (i === visible.length - 1 && hasBelow) return pc.dim('...');
    return renderItem(opt, start + i === cursor);
  });
}

// ── Hacky but necessary: override private onKeypress ─────────
// TextPrompt.onKeypress is private in the type definition but exists at runtime.
// We need to intercept arrow keys for list navigation without triggering
// @clack/core's vim-style key aliases (j→up, k→down) which would interfere
// with typing in the search box.

type KeyInfo = { name?: string; sequence?: string };
type KeypressFn = (char: string | undefined, key: KeyInfo) => void;

function overrideKeypress(prompt: TextPrompt): {
  orig: KeypressFn;
  set: (fn: KeypressFn) => void;
} {
  const p = prompt as unknown as Record<string, KeypressFn>;
  const orig = p['onKeypress'].bind(prompt);
  return {
    orig,
    set(fn: KeypressFn) {
      p['onKeypress'] = fn;
    },
  };
}

// ── searchSelect ─────────────────────────────────────────────

export async function searchSelect<T>(opts: {
  message: string;
  options: SearchOption<T>[];
  threshold?: number;
}): Promise<T | symbol> {
  const { message, options, threshold = 10 } = opts;

  if (options.length <= threshold) {
    return select({ message, options }) as Promise<T | symbol>;
  }

  let filtered = [...options];
  let listCursor = 0;
  let selectedLabel = '';

  const prompt = new TextPrompt({
    defaultValue: '',
    validate() {
      if (filtered.length === 0) return '没有匹配结果，请修改关键字';
      return undefined;
    },
    render() {
      const st = this.state;
      const bar = st === 'error' ? pc.yellow : pc.cyan;
      const hdr = `${pc.gray(S_BAR)}\n${sym(st)}  ${message}\n`;

      if (st === 'submit') {
        return `${hdr}${pc.gray(S_BAR)}  ${pc.dim(selectedLabel)}`;
      }
      if (st === 'cancel') {
        const lbl = selectedLabel || '';
        return `${hdr}${pc.gray(S_BAR)}  ${pc.strikethrough(pc.dim(lbl))}${lbl ? `\n${pc.gray(S_BAR)}` : ''}`;
      }
      if (st === 'error') {
        const input = this.value ? this.valueWithCursor : pc.inverse(pc.hidden('_')) + pc.dim(' 输入过滤...');
        return [
          hdr.trimEnd(),
          `${pc.yellow(S_BAR)}  🔍 ${input}`,
          `${pc.yellow(S_BAR_END)}  ${pc.yellow(this.error)}`,
          '',
        ].join('\n');
      }

      // active / initial
      const input = this.value ? this.valueWithCursor : pc.inverse(pc.hidden('_')) + pc.dim(' 输入过滤...');
      const optLines = scrollWindow(filtered, listCursor, (opt, active) => {
        if (active) {
          const hint = opt.hint ? pc.dim(` (${opt.hint})`) : '';
          return `${pc.green(S_RADIO_ON)} ${opt.label}${hint}`;
        }
        return `${pc.dim(S_RADIO_OFF)} ${pc.dim(opt.label)}`;
      });

      const kw = (this.value || '').trim();
      const parts = [
        hdr.trimEnd(),
        `${bar(S_BAR)}  🔍 ${input}`,
        ...optLines.map(l => `${bar(S_BAR)}  ${l}`),
      ];
      if (kw) {
        parts.push(`${bar(S_BAR)}  ${pc.dim(`── ${filtered.length}/${options.length} 匹配 ──`)}`);
      }
      parts.push(`${bar(S_BAR_END)}\n`);
      return parts.join('\n');
    },
  });

  // Override onKeypress for arrow key navigation
  const kp = overrideKeypress(prompt);
  kp.set((char, key) => {
    if (key.name === 'up') {
      if (filtered.length > 0) {
        listCursor = listCursor <= 0 ? filtered.length - 1 : listCursor - 1;
      }
      (prompt as unknown as { render(): void }).render();
      return;
    }
    if (key.name === 'down') {
      if (filtered.length > 0) {
        listCursor = listCursor >= filtered.length - 1 ? 0 : listCursor + 1;
      }
      (prompt as unknown as { render(): void }).render();
      return;
    }
    kp.orig(char, key);
  });

  // Re-filter on value change
  prompt.on('value', () => {
    const kw = (prompt.value || '').trim();
    filtered = filterOpts(options, kw);
    listCursor = Math.min(listCursor, Math.max(filtered.length - 1, 0));
  });

  // Capture selected value on finalize
  let result: T | undefined;
  prompt.once('finalize', () => {
    if (filtered.length > 0) {
      result = filtered[listCursor].value;
      selectedLabel = filtered[listCursor].label;
    }
  });

  const raw = await prompt.prompt();
  if (isCancel(raw)) return raw;
  return result as T;
}

// ── searchMultiselect ────────────────────────────────────────

export async function searchMultiselect<T>(opts: {
  message: string;
  options: SearchOption<T>[];
  required?: boolean;
  threshold?: number;
}): Promise<T[] | symbol> {
  const { message, options, required = true, threshold = 10 } = opts;

  if (options.length <= threshold) {
    return multiselect({ message, options, required }) as Promise<T[] | symbol>;
  }

  let filtered = [...options];
  let listCursor = 0;
  const selectedValues = new Set<T>();

  function renderCb(opt: SearchOption<T>, active: boolean): string {
    const sel = selectedValues.has(opt.value);
    const hint = opt.hint ? pc.dim(` (${opt.hint})`) : '';
    if (active && sel) return `${pc.green(S_CHECK_ON)} ${opt.label}${hint}`;
    if (active) return `${pc.cyan(S_CHECK_OFF)} ${opt.label}${hint}`;
    if (sel) return `${pc.green(S_CHECK_ON)} ${pc.dim(opt.label)}`;
    return `${pc.dim(S_CHECK_OFF)} ${pc.dim(opt.label)}`;
  }

  const prompt = new TextPrompt({
    defaultValue: '',
    validate() {
      if (required && selectedValues.size === 0) {
        return `请至少选择一项\n${pc.reset(pc.dim(`${pc.gray(pc.bgWhite(pc.inverse(' 空格 ')))} 切换选择，${pc.gray(pc.bgWhite(pc.inverse(' 回车 ')))} 确认`))}`;
      }
      return undefined;
    },
    render() {
      const st = this.state;
      const bar = st === 'error' ? pc.yellow : pc.cyan;
      const countSuffix = selectedValues.size > 0 ? pc.dim(` (已选 ${selectedValues.size} 项)`) : '';
      const hdr = `${pc.gray(S_BAR)}\n${sym(st)}  ${message}${countSuffix}\n`;

      if (st === 'submit') {
        const labels = options
          .filter(o => selectedValues.has(o.value))
          .map(o => pc.dim(o.label))
          .join(pc.dim(', '));
        return `${hdr}${pc.gray(S_BAR)}  ${labels || pc.dim('无')}`;
      }
      if (st === 'cancel') {
        const labels = options
          .filter(o => selectedValues.has(o.value))
          .map(o => pc.strikethrough(pc.dim(o.label)))
          .join(pc.dim(', '));
        return `${hdr}${pc.gray(S_BAR)}  ${labels}${labels ? `\n${pc.gray(S_BAR)}` : ''}`;
      }
      if (st === 'error') {
        const input = this.value ? this.valueWithCursor : pc.inverse(pc.hidden('_')) + pc.dim(' 输入过滤... (空格切换选择)');
        const optLines = scrollWindow(filtered, listCursor, renderCb);
        const errLines = this.error.split('\n').map((line: string, i: number) =>
          i === 0 ? `${pc.yellow(S_BAR_END)}  ${pc.yellow(line)}` : `   ${line}`,
        );
        return [
          hdr.trimEnd(),
          `${pc.yellow(S_BAR)}  🔍 ${input}`,
          ...optLines.map(l => `${pc.yellow(S_BAR)}  ${l}`),
          ...errLines,
          '',
        ].join('\n');
      }

      // active / initial
      const input = this.value ? this.valueWithCursor : pc.inverse(pc.hidden('_')) + pc.dim(' 输入过滤... (空格切换选择)');
      const optLines = scrollWindow(filtered, listCursor, renderCb);

      const kw = (this.value || '').trim();
      const parts = [
        hdr.trimEnd(),
        `${bar(S_BAR)}  🔍 ${input}`,
        ...optLines.map(l => `${bar(S_BAR)}  ${l}`),
      ];
      if (kw) {
        parts.push(`${bar(S_BAR)}  ${pc.dim(`── ${filtered.length}/${options.length} 匹配 ──`)}`);
      }
      parts.push(`${bar(S_BAR_END)}\n`);
      return parts.join('\n');
    },
  });

  // Override onKeypress
  const kp = overrideKeypress(prompt);
  kp.set((char, key) => {
    // Arrow keys: navigate list
    if (key.name === 'up') {
      if (filtered.length > 0) {
        listCursor = listCursor <= 0 ? filtered.length - 1 : listCursor - 1;
      }
      (prompt as unknown as { render(): void }).render();
      return;
    }
    if (key.name === 'down') {
      if (filtered.length > 0) {
        listCursor = listCursor >= filtered.length - 1 ? 0 : listCursor + 1;
      }
      (prompt as unknown as { render(): void }).render();
      return;
    }
    // Space: toggle selection (don't insert into search text)
    if (char === ' ' || key.name === 'space') {
      if (filtered.length > 0) {
        const item = filtered[listCursor];
        if (selectedValues.has(item.value)) {
          selectedValues.delete(item.value);
        } else {
          selectedValues.add(item.value);
        }
      }
      (prompt as unknown as { render(): void }).render();
      return;
    }
    kp.orig(char, key);
  });

  // Re-filter on value change
  prompt.on('value', () => {
    const kw = (prompt.value || '').trim();
    filtered = filterOpts(options, kw);
    listCursor = Math.min(listCursor, Math.max(filtered.length - 1, 0));
  });

  // Capture result on finalize
  let result: T[] = [];
  prompt.once('finalize', () => {
    result = options.filter(o => selectedValues.has(o.value)).map(o => o.value);
  });

  const raw = await prompt.prompt();
  if (isCancel(raw)) return raw;
  return result;
}
