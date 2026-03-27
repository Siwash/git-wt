import fs from 'node:fs';
import { select, confirm, spinner, log } from '@clack/prompts';
import { onCancel } from '../lib/utils';
import { loadConfig, removeWorkspaceById } from '../lib/config';
import { removeWorktree } from '../lib/git';
import pc from 'picocolors';

export async function removeWorkspaceCmd(): Promise<void> {
  const config = loadConfig();

  if (config.workspaces.length === 0) {
    log.info('没有活跃的工作区');
    return;
  }

  const wsId = await select({
    message: '选择要删除的工作区:',
    options: config.workspaces.map(ws => ({
      value: ws.id,
      label: `${ws.branch} ← ${ws.sourceDir}`,
      hint: ws.repos.map(r => r.name).join(', '),
    })),
  });
  onCancel(wsId);

  const ws = config.workspaces.find(w => w.id === wsId)!;

  // Show workspace details
  log.info(`工作区: ${ws.targetDir}`);
  log.info(`分支: ${ws.branch}`);
  for (const repo of ws.repos) {
    log.message(`  ${repo.name} → ${repo.worktreePath}`);
  }

  const yes = await confirm({ message: '确认删除? (将移除所有 worktree)' });
  onCancel(yes);
  if (!yes) return;

  // 1. 从 git 注销每个 worktree
  const s = spinner();
  for (const repo of ws.repos) {
    s.start(`注销 ${repo.name}...`);
    try {
      await removeWorktree(repo.sourcePath, repo.worktreePath);
      s.stop(`${pc.green('ok')} ${repo.name}`);
    } catch (err: unknown) {
      s.stop(`${pc.yellow('⚠')} ${repo.name}: ${(err as Error).message}`);
    }
  }

  // 2. 强制删除整个目标目录
  if (fs.existsSync(ws.targetDir)) {
    try {
      fs.rmSync(ws.targetDir, { recursive: true, force: true });
    } catch (err: unknown) {
      log.error(`删除目录失败: ${(err as Error).message}\n  ${ws.targetDir}`);
      return;
    }
  }

  if (fs.existsSync(ws.targetDir)) {
    log.error(`无法删除目录 ${ws.targetDir}，工作区保留在配置中`);
    return;
  }

  // 3. 清除配置
  removeWorkspaceById(config, ws.id);

  log.success('工作区已删除');
}
