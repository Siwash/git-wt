# gwt — Git Worktree Manager

Batch-create git worktrees across multiple repositories with a beautiful TUI.

If you work with many interdependent git repos under one directory and need to switch branches across all of them at once, `gwt` does it in seconds.

## The Problem

```
D:\code\my-project\
├── service-a/  (main)
├── service-b/  (main)
├── service-c/  (main)
└── shared-lib/ (main)
```

You need to work on `feature/new-ui` across all of them. Manually running `git worktree add` for each repo is tedious.

## The Solution

```bash
gwt create
```

```
D:\code\my-project\                          # Original
├── service-a/  (main)
├── service-b/  (main)
└── ...

D:\code\my-project--feature--new-ui\         # Worktree group (auto-created)
├── service-a/  (feature/new-ui)
├── service-b/  (feature/new-ui)
└── ...
```

## Install

```bash
npm install -g git-wt
```

Requires Node.js >= 18 and Git >= 2.20.

## Usage

### Interactive mode

```bash
gwt
```

Launches TUI menu with all available commands.

### Commands

```bash
gwt create    # Scan directory → pick repos → pick branch → batch create worktrees
gwt list      # Show all active workspaces
gwt remove    # Remove a workspace (deletes worktrees and cleans up)
```

### Create flow

1. Enter the directory containing your git repos
2. Multi-select which repos to include
3. Pick a branch from the list (or type a new one)
4. Confirm target directory (defaults to `<source>--<branch>`)
5. Done — all worktrees created in one shot

### Config

Workspace records are stored at `~/.gwt/config.json`. This file tracks created workspaces so `gwt list` and `gwt remove` work.

## How It Works

- **Scans** a directory for git repos (direct children only, checks for `.git`)
- **Fetches** latest branches from the first selected repo (8s timeout, falls back to local cache)
- **Creates worktrees** with smart branch handling:
  - Branch exists locally → `git worktree add -f` (allows same branch in multiple worktrees)
  - Branch exists on remote → creates local tracking branch
  - Branch is new → creates it from HEAD
- **Branch → directory name**: `feature/new-ui` becomes `feature--new-ui`

## License

MIT
