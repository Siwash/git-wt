export interface WorkspaceRepo {
  name: string;           // 项目名 (保持原名)
  sourcePath: string;     // 原始 git 仓库路径
  branch: string;         // worktree 分支
  worktreePath: string;   // worktree 路径
}

export interface Workspace {
  id: string;
  sourceDir: string;      // 扫描的源目录
  targetDir: string;      // worktree 组目录
  branch: string;         // 分支名
  repos: WorkspaceRepo[];
  createdAt: string;
}

export interface AppConfig {
  workspaces: Workspace[];
}
