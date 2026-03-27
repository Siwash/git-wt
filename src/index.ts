import { Command } from 'commander';
import { intro, select, outro } from '@clack/prompts';
import { onCancel } from './lib/utils';
import { createWorkspace } from './commands/create';
import { listWorkspaces } from './commands/list';
import { removeWorkspaceCmd } from './commands/remove';
import pc from 'picocolors';

async function mainMenu(): Promise<void> {
  intro(pc.cyan('Git Worktree Manager'));

  const action = await select({
    message: '选择操作:',
    options: [
      { value: 'create', label: '创建工作区', hint: '扫描目录，批量检出 worktree' },
      { value: 'list', label: '查看工作区', hint: '列出所有活跃的工作区' },
      { value: 'remove', label: '删除工作区', hint: '移除 worktree 并清理' },
    ],
  });
  onCancel(action);

  switch (action) {
    case 'create': await createWorkspace(); break;
    case 'list': await listWorkspaces(); break;
    case 'remove': await removeWorkspaceCmd(); break;
  }

  outro(pc.dim('done'));
}

const program = new Command();

program
  .name('gwt')
  .description('Git Worktree Manager - 多仓库 worktree 管理工具')
  .version('1.1.0')
  .action(mainMenu);

program
  .command('create')
  .description('创建工作区 - 扫描目录，批量检出 worktree')
  .action(async () => {
    intro(pc.cyan('创建工作区'));
    await createWorkspace();
    outro(pc.dim('done'));
  });

program
  .command('list')
  .description('查看所有活跃工作区')
  .action(async () => {
    intro(pc.cyan('工作区列表'));
    await listWorkspaces();
    outro(pc.dim('done'));
  });

program
  .command('remove')
  .description('删除工作区')
  .action(async () => {
    intro(pc.cyan('删除工作区'));
    await removeWorkspaceCmd();
    outro(pc.dim('done'));
  });

program.parse();
