import path from 'node:path';
import { text, confirm, spinner, log, note } from '@clack/prompts';
import { onCancel, searchSelect, searchMultiselect } from '../lib/utils';
import { loadConfig, addWorkspace, generateId } from '../lib/config';
import { scanGitRepos, fetchAll, getBranches, createWorktree, branchToDir, isGitRepo } from '../lib/git';
import type { WorkspaceRepo } from '../lib/types';

export async function createWorkspace(): Promise<void> {
  const config = loadConfig();

  const cwd = process.cwd();

  // 1. 输入源目录 — 默认当前目录
  const sourceDir = await text({
    message: '项目所在目录:',
    initialValue: cwd,
    validate: (val) => {
      if (!val) return '请输入目录路径';
    },
  });
  onCancel(sourceDir);

  const resolvedSource = path.resolve(sourceDir as string);

  // 2. 扫描 git 仓库（支持目录本身是 git 仓库的情况）
  const s = spinner();
  s.start('扫描 git 仓库...');
  let repos: Array<{ name: string; path: string }>;
  try {
    repos = await scanGitRepos(resolvedSource);
  } catch (err: unknown) {
    s.stop(`扫描失败: ${(err as Error).message}`);
    return;
  }
  if (repos.length === 0) {
    s.stop(`${resolvedSource} 下未发现 git 仓库`);
    return;
  }

  const isSingleRepo = repos.length === 1 && isGitRepo(resolvedSource);
  s.stop(isSingleRepo
    ? `当前目录是 git 仓库: ${repos[0].name}`
    : `发现 ${repos.length} 个 git 仓库`
  );

  // 3. 选择项目 — 单仓库跳过多选
  let selectedRepos: Array<{ name: string; path: string }>;

  if (isSingleRepo) {
    selectedRepos = repos;
  } else {
    const selectedNames = await searchMultiselect({
      message: '选择要创建 worktree 的项目:',
      options: repos.map(r => ({
        value: r.name,
        label: r.name,
      })),
      required: true,
    });
    onCancel(selectedNames);

    selectedRepos = selectedNames.map(
      name => repos.find(r => r.name === name)!
    );
  }

  // 4. 刷新分支列表 — 包裹在 try/catch 内，防止 unhandled rejection 触发 spinner 错误
  const firstRepo = selectedRepos[0];
  const sf = spinner();
  sf.start(`加载分支列表 (${firstRepo.name})...`);

  let branches: { local: string[]; remote: string[] };
  let branchHint = '已刷新远端分支';

  try {
    await fetchAll(firstRepo.path);
  } catch {
    branchHint = '远端刷新失败，使用本地缓存';
  }

  try {
    branches = await getBranches(firstRepo.path);
  } catch (err: unknown) {
    sf.stop(`获取分支失败: ${(err as Error).message}`);
    return;
  }
  sf.stop(branchHint);

  // 5. 选分支 — 基于第一个项目的分支列表 + 自定义输入
  const branchOptions = [
    ...branches.local.map(b => ({ value: b, label: b, hint: 'local' })),
    ...branches.remote.map(b => ({ value: b, label: b, hint: 'remote' })),
    { value: '__custom__', label: '+ 输入分支名' },
  ];

  const selectedBranch = await searchSelect({
    message: `选择分支 (基于 ${firstRepo.name} 的分支列表):`,
    options: branchOptions,
  });
  onCancel(selectedBranch);

  let branch: string;
  if (selectedBranch === '__custom__') {
    const custom = await text({
      message: '分支名:',
      placeholder: 'feature/xxx',
      validate: (val) => { if (!val) return '请输入分支名'; },
    });
    onCancel(custom);
    branch = custom as string;
  } else {
    branch = selectedBranch;
  }

  // 6. 目标目录 — 默认: <源目录(或父目录)>--<分支名>
  const baseDir = isSingleRepo ? path.dirname(resolvedSource) : path.dirname(resolvedSource);
  const baseName = isSingleRepo ? path.basename(resolvedSource) : path.basename(resolvedSource);
  const defaultTarget = path.join(
    baseDir,
    `${baseName}--${branchToDir(branch)}`
  );

  const targetDir = await text({
    message: 'worktree 组目录:',
    initialValue: defaultTarget,
    validate: (val) => { if (!val) return '请输入路径'; },
  });
  onCancel(targetDir);

  const resolvedTarget = path.resolve(targetDir as string);

  // 7. 确认
  const summary = selectedRepos.map(r => `  ${r.name}`).join('\n');
  note(
    `${summary}\n\n  分支: ${branch}\n  目标: ${resolvedTarget}`,
    `即将创建 ${selectedRepos.length} 个 worktree`
  );

  const confirmed = await confirm({ message: '确认创建?' });
  onCancel(confirmed);
  if (!confirmed) return;

  // 8. 批量创建 worktree
  const wsRepos: WorkspaceRepo[] = [];

  for (const repo of selectedRepos) {
    const wtPath = isSingleRepo
      ? resolvedTarget // 单仓库: worktree 就是目标目录本身
      : path.join(resolvedTarget, repo.name); // 多仓库: 每个仓库是目标目录的子目录
    const s2 = spinner();
    s2.start(`${repo.name} → ${branch}`);

    try {
      await createWorktree(repo.path, wtPath, branch);
      wsRepos.push({
        name: repo.name,
        sourcePath: repo.path,
        branch,
        worktreePath: wtPath,
      });
      s2.stop(`${repo.name} → ${branch}`);
    } catch (err: unknown) {
      s2.stop(`${repo.name} 失败: ${(err as Error).message}`);
    }
  }

  // 9. 保存记录
  if (wsRepos.length > 0) {
    addWorkspace(config, {
      id: generateId(),
      sourceDir: resolvedSource,
      targetDir: resolvedTarget,
      branch,
      repos: wsRepos,
      createdAt: new Date().toISOString(),
    });

    note(
      wsRepos.map(r => `  ${r.name}`).join('\n') +
      `\n\n  cd ${resolvedTarget}`,
      `完成 (${wsRepos.length}/${selectedRepos.length} 成功)`
    );
  } else {
    log.error('所有仓库创建失败');
  }
}
