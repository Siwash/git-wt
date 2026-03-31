import { isCancel, cancel, text, select, multiselect, log } from '@clack/prompts';

export function onCancel<T>(value: T): asserts value is Exclude<T, symbol> {
  if (isCancel(value)) {
    cancel('已取消');
    process.exit(0);
  }
}

// ── searchable select / multiselect ──────────────────────────────

interface SelectOption<T> {
  value: T;
  label: string;
  hint?: string;
}

const REFILTER = '__refilter__';

function filterOptions<T>(options: SelectOption<T>[], keyword: string): SelectOption<T>[] {
  if (!keyword) return options;
  const kw = keyword.toLowerCase();
  return options.filter(
    o => o.label.toLowerCase().includes(kw) || o.hint?.toLowerCase().includes(kw),
  );
}

/**
 * select with text filter.
 * When options > threshold, prompts user to type a keyword first.
 */
export async function searchableSelect<T>(opts: {
  message: string;
  options: SelectOption<T>[];
  threshold?: number;
}): Promise<T> {
  const { message, options, threshold = 10 } = opts;

  if (options.length <= threshold) {
    const result = await select({ message, options });
    onCancel(result);
    return result as T;
  }

  // filter loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const keyword = await text({
      message: `🔍 输入关键字过滤 (${options.length} 项, 留空显示全部):`,
      placeholder: '例如 feature、release …',
      defaultValue: '',
    });
    onCancel(keyword);

    const kw = (keyword as string).trim();
    const filtered = filterOptions(options, kw);

    if (filtered.length === 0) {
      log.warning(`没有匹配 "${kw}" 的结果，请重试`);
      continue;
    }

    const suffix = kw ? ` (匹配 ${filtered.length}/${options.length})` : '';
    const display: SelectOption<T | string>[] = [
      ...filtered,
      ...(kw ? [{ value: REFILTER, label: '↩ 重新过滤' } as SelectOption<string>] : []),
    ];

    const result = await select({ message: message + suffix, options: display });
    onCancel(result);

    if (result === REFILTER) continue;
    return result as T;
  }
}

/**
 * multiselect with text filter.
 * When options > threshold, prompts user to type a keyword first.
 */
export async function searchableMultiselect<T>(opts: {
  message: string;
  options: SelectOption<T>[];
  required?: boolean;
  threshold?: number;
}): Promise<T[]> {
  const { message, options, required = true, threshold = 10 } = opts;

  if (options.length <= threshold) {
    const result = await multiselect({ message, options, required });
    onCancel(result);
    return result as T[];
  }

  // filter loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const keyword = await text({
      message: `🔍 输入关键字过滤 (${options.length} 项, 留空显示全部):`,
      placeholder: '例如 core、api …',
      defaultValue: '',
    });
    onCancel(keyword);

    const kw = (keyword as string).trim();
    const filtered = filterOptions(options, kw);

    if (filtered.length === 0) {
      log.warning(`没有匹配 "${kw}" 的结果，请重试`);
      continue;
    }

    const suffix = kw ? ` (匹配 ${filtered.length}/${options.length})` : '';
    const result = await multiselect({ message: message + suffix, options: filtered, required });
    onCancel(result);
    return result as T[];
  }
}
