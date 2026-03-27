import { log, note } from '@clack/prompts';
import { loadConfig } from '../lib/config';
import pc from 'picocolors';

export async function listWorkspaces(): Promise<void> {
  const config = loadConfig();

  if (config.workspaces.length === 0) {
    log.info('没有活跃的工作区，使用 gwt create 创建');
    return;
  }

  for (const ws of config.workspaces) {
    const repos = ws.repos
      .map(r => `  ${pc.cyan(r.name)} → ${pc.green(r.worktreePath)}`)
      .join('\n');
    const time = new Date(ws.createdAt).toLocaleString();

    note(
      `${repos}\n\n  创建于: ${pc.dim(time)}`,
      `${pc.yellow(ws.branch)} ← ${ws.sourceDir}`
    );
  }

  log.info(`共 ${config.workspaces.length} 个工作区`);
}
