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

  // Remove each worktree
  const s = spinner();
  for (const repo of ws.repos) {
    s.start(`移除 ${repo.name}...`);
    try {
      // Check if worktree directory exists
      if (fs.existsSync(repo.worktreePath)) {
        await removeWorktree(repo.sourcePath, repo.worktreePath);
      }
      s.stop(`${pc.green('ok')} ${repo.name}`);
    } catch (err: unknown) {
      s.stop(`${pc.red('fail')} ${repo.name}: ${(err as Error).message}`);
    }
  }

  // Remove from config
  removeWorkspaceById(config, ws.id);

  // Try to remove the target directory if empty
  try {
    if (fs.existsSync(ws.targetDir)) {
      const entries = fs.readdirSync(ws.targetDir);
      if (entries.length === 0) {
        fs.rmdirSync(ws.targetDir);
        log.info(`已清理空目录 ${ws.targetDir}`);
      }
    }
  } catch {
    // ignore cleanup errors
  }

  log.success('工作区已删除');
}
