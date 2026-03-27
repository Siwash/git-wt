import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execAsync = promisify(exec);

const GIT_TIMEOUT = 30_000; // 30s per git command
const FETCH_TIMEOUT = 8_000; // 8s for fetch，超时直接回退本地缓存

async function git(args: string, cwd: string, timeout = GIT_TIMEOUT): Promise<string> {
  try {
    const { stdout } = await execAsync(`git ${args}`, {
      cwd,
      encoding: 'utf-8',
      timeout,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
    return stdout.trim();
  } catch (error: unknown) {
    const err = error as { killed?: boolean; stderr?: string; message: string };
    if (err.killed) throw new Error('git 命令超时');
    const msg = err.stderr?.trim() || err.message;
    throw new Error(msg);
  }
}

/** 检查是否是 git 仓库 (纯 fs 检查，不 spawn 进程) */
export function isGitRepo(dirPath: string): boolean {
  const gitPath = path.join(dirPath, '.git');
  return fs.existsSync(gitPath);
}

/** 扫描目录下所有直接子目录中的 git 仓库 */
export async function scanGitRepos(dir: string): Promise<Array<{ name: string; path: string }>> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const repos: Array<{ name: string; path: string }> = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(dir, entry.name);
    if (isGitRepo(fullPath)) {
      repos.push({ name: entry.name, path: fullPath });
    }
  }

  return repos.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchAll(repoPath: string): Promise<void> {
  await git('fetch --all --prune', repoPath, FETCH_TIMEOUT);
}

export async function getBranches(repoPath: string): Promise<{ local: string[]; remote: string[] }> {
  // 并行执行两个 git branch 命令
  const [localRaw, remoteRaw] = await Promise.all([
    git('branch --format=%(refname:short)', repoPath),
    git('branch -r --format=%(refname:short)', repoPath),
  ]);

  const local = localRaw ? localRaw.split('\n').map(b => b.trim()).filter(Boolean) : [];
  const remote = remoteRaw
    ? remoteRaw
        .split('\n')
        .map(b => b.trim())
        .filter(b => b && b.includes('/') && !b.includes('HEAD'))
        .map(b => b.replace(/^[^/]+\//, ''))
    : [];

  const remoteOnly = [...new Set(remote.filter(r => !local.includes(r)))];
  return { local, remote: remoteOnly };
}

export async function getCurrentBranch(repoPath: string): Promise<string> {
  return git('branch --show-current', repoPath);
}

export async function createWorktree(repoPath: string, targetPath: string, branch: string): Promise<void> {
  // 先查本地分支是否已存在
  const localRaw = await git('branch --list --format=%(refname:short)', repoPath);
  const localBranches = localRaw ? localRaw.split('\n').map(b => b.trim()).filter(Boolean) : [];

  if (localBranches.includes(branch)) {
    // 本地已有该分支，用 -f 允许同一分支在多个 worktree 中 checkout
    await git(`worktree add -f "${targetPath}" "${branch}"`, repoPath);
    return;
  }

  // 本地没有，查 remote
  const remoteRaw = await git('branch -r --format=%(refname:short)', repoPath);
  const remoteBranches = remoteRaw ? remoteRaw.split('\n').map(b => b.trim()).filter(Boolean) : [];
  const remoteRef = remoteBranches.find(b => b.endsWith(`/${branch}`));

  if (remoteRef) {
    // 从 remote 创建本地跟踪分支
    await git(`worktree add -b "${branch}" "${targetPath}" "${remoteRef}"`, repoPath);
    return;
  }

  // 分支完全不存在，新建
  await git(`worktree add -b "${branch}" "${targetPath}"`, repoPath);
}

export async function removeWorktree(repoPath: string, worktreePath: string): Promise<void> {
  await git(`worktree remove "${worktreePath}" --force`, repoPath);
}

/** 将分支名转为安全的目录名: feature/new-ui → feature--new-ui */
export function branchToDir(branch: string): string {
  return branch.replace(/\//g, '--');
}
