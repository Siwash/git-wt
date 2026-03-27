import path from 'node:path';
import { select, multiselect, text, confirm, spinner, log, note } from '@clack/prompts';
import { onCancel } from '../lib/utils';
import { loadConfig, addWorkspace, generateId } from '../lib/config';
import { scanGitRepos, fetchAll, getBranches, createWorktree, branchToDir } from '../lib/git';
import type { WorkspaceRepo } from '../lib/types';

export async function createWorkspace(): Promise<void> {
  const config = loadConfig();

  // 1. 输入源目录
  const sourceDir = await text({
    message: '项目所在目录 (包含多个 git 仓库的文件夹):',
    placeholder: 'D:\\code\\AI-coding',
    validate: (val) => {
      if (!val) return '请输入目录路径';
    },
  });
  onCancel(sourceDir);

  const resolvedSource = path.resolve(sourceDir as string);

  // 2. 扫描 git 仓库
  const s = spinner();
  s.start('扫描 git 仓库...');
  const repos = await scanGitRepos(resolvedSource);
  if (repos.length === 0) {
    s.stop(`${resolvedSource} 下未发现 git 仓库`);
    return;
  }
  s.stop(`发现 ${repos.length} 个 git 仓库`);

  // 3. 多选项目
  const selectedNames = await multiselect({
    message: '选择要创建 worktree 的项目:',
    options: repos.map(r => ({
      value: r.name,
      label: r.name,
    })),
    required: true,
  });
  onCancel(selectedNames);

  const selectedRepos = (selectedNames as string[]).map(
    name => repos.find(r => r.name === name)!
  );

  // 4. 只刷新第一个仓库的分支列表，避免多仓库 fetch 卡顿
  const firstRepo = selectedRepos[0];
  const sf = spinner();
  sf.start(`加载分支列表 (${firstRepo.name})...`);
  let branchHint = '已刷新远端分支';
  try {
    await fetchAll(firstRepo.path);
  } catch {
    branchHint = '远端刷新失败，使用本地缓存';
  }

  const branches = await getBranches(firstRepo.path);
  sf.stop(branchHint);

  // 5. 选分支 — 基于第一个项目的分支列表 + 自定义输入
  const branchOptions = [
    ...branches.local.map(b => ({ value: b, label: b, hint: 'local' })),
    ...branches.remote.map(b => ({ value: b, label: b, hint: 'remote' })),
    { value: '__custom__', label: '+ 输入分支名' },
  ];

  const selectedBranch = await select({
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
    branch = selectedBranch as string;
  }

  // 6. 目标目录 — 默认: <源目录>--<分支名>
  const defaultTarget = path.join(
    path.dirname(resolvedSource),
    `${path.basename(resolvedSource)}--${branchToDir(branch)}`
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
    const wtPath = path.join(resolvedTarget, repo.name);
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
