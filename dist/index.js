#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import { intro, select as select3, outro } from "@clack/prompts";

// src/lib/utils.ts
import { isCancel, cancel } from "@clack/prompts";
function onCancel(value) {
  if (isCancel(value)) {
    cancel("\u5DF2\u53D6\u6D88");
    process.exit(0);
  }
}

// src/commands/create.ts
import path3 from "path";
import { select, multiselect, text, confirm, spinner, log, note } from "@clack/prompts";

// src/lib/config.ts
import fs from "fs";
import path from "path";
import os from "os";
var CONFIG_DIR = path.join(os.homedir(), ".gwt");
var CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
function defaultConfig() {
  return { workspaces: [] };
}
function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return defaultConfig();
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultConfig();
  }
}
function saveConfig(config) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}
function addWorkspace(config, workspace) {
  config.workspaces.push(workspace);
  saveConfig(config);
  return config;
}
function removeWorkspaceById(config, id) {
  config.workspaces = config.workspaces.filter((w) => w.id !== id);
  saveConfig(config);
  return config;
}
function generateId() {
  return `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// src/lib/git.ts
import { exec } from "child_process";
import { promisify } from "util";
import fs2 from "fs";
import path2 from "path";
var execAsync = promisify(exec);
var GIT_TIMEOUT = 3e4;
var FETCH_TIMEOUT = 8e3;
async function git(args, cwd, timeout = GIT_TIMEOUT) {
  try {
    const { stdout } = await execAsync(`git ${args}`, {
      cwd,
      encoding: "utf-8",
      timeout,
      maxBuffer: 10 * 1024 * 1024
      // 10MB
    });
    return stdout.trim();
  } catch (error) {
    const err = error;
    if (err.killed) throw new Error("git \u547D\u4EE4\u8D85\u65F6");
    const msg = err.stderr?.trim() || err.message;
    throw new Error(msg);
  }
}
function isGitRepo(dirPath) {
  const gitPath = path2.join(dirPath, ".git");
  return fs2.existsSync(gitPath);
}
async function scanGitRepos(dir) {
  const entries = fs2.readdirSync(dir, { withFileTypes: true });
  const repos = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fullPath = path2.join(dir, entry.name);
    if (isGitRepo(fullPath)) {
      repos.push({ name: entry.name, path: fullPath });
    }
  }
  return repos.sort((a, b) => a.name.localeCompare(b.name));
}
async function fetchAll(repoPath) {
  await git("fetch --all --prune", repoPath, FETCH_TIMEOUT);
}
async function getBranches(repoPath) {
  const [localRaw, remoteRaw] = await Promise.all([
    git("branch --format=%(refname:short)", repoPath),
    git("branch -r --format=%(refname:short)", repoPath)
  ]);
  const local = localRaw ? localRaw.split("\n").map((b) => b.trim()).filter(Boolean) : [];
  const remote = remoteRaw ? remoteRaw.split("\n").map((b) => b.trim()).filter((b) => b && b.includes("/") && !b.includes("HEAD")).map((b) => b.replace(/^[^/]+\//, "")) : [];
  const remoteOnly = [...new Set(remote.filter((r) => !local.includes(r)))];
  return { local, remote: remoteOnly };
}
async function createWorktree(repoPath, targetPath, branch) {
  const localRaw = await git("branch --list --format=%(refname:short)", repoPath);
  const localBranches = localRaw ? localRaw.split("\n").map((b) => b.trim()).filter(Boolean) : [];
  if (localBranches.includes(branch)) {
    await git(`worktree add -f "${targetPath}" "${branch}"`, repoPath);
    return;
  }
  const remoteRaw = await git("branch -r --format=%(refname:short)", repoPath);
  const remoteBranches = remoteRaw ? remoteRaw.split("\n").map((b) => b.trim()).filter(Boolean) : [];
  const remoteRef = remoteBranches.find((b) => b.endsWith(`/${branch}`));
  if (remoteRef) {
    await git(`worktree add -b "${branch}" "${targetPath}" "${remoteRef}"`, repoPath);
    return;
  }
  await git(`worktree add -b "${branch}" "${targetPath}"`, repoPath);
}
async function removeWorktree(repoPath, worktreePath) {
  await git(`worktree remove "${worktreePath}" --force`, repoPath);
}
function branchToDir(branch) {
  return branch.replace(/\//g, "--");
}

// src/commands/create.ts
async function createWorkspace() {
  const config = loadConfig();
  const sourceDir = await text({
    message: "\u9879\u76EE\u6240\u5728\u76EE\u5F55 (\u5305\u542B\u591A\u4E2A git \u4ED3\u5E93\u7684\u6587\u4EF6\u5939):",
    placeholder: "D:\\code\\AI-coding",
    validate: (val) => {
      if (!val) return "\u8BF7\u8F93\u5165\u76EE\u5F55\u8DEF\u5F84";
    }
  });
  onCancel(sourceDir);
  const resolvedSource = path3.resolve(sourceDir);
  const s = spinner();
  s.start("\u626B\u63CF git \u4ED3\u5E93...");
  const repos = await scanGitRepos(resolvedSource);
  if (repos.length === 0) {
    s.stop(`${resolvedSource} \u4E0B\u672A\u53D1\u73B0 git \u4ED3\u5E93`);
    return;
  }
  s.stop(`\u53D1\u73B0 ${repos.length} \u4E2A git \u4ED3\u5E93`);
  const selectedNames = await multiselect({
    message: "\u9009\u62E9\u8981\u521B\u5EFA worktree \u7684\u9879\u76EE:",
    options: repos.map((r) => ({
      value: r.name,
      label: r.name
    })),
    required: true
  });
  onCancel(selectedNames);
  const selectedRepos = selectedNames.map(
    (name) => repos.find((r) => r.name === name)
  );
  const firstRepo = selectedRepos[0];
  const sf = spinner();
  sf.start(`\u52A0\u8F7D\u5206\u652F\u5217\u8868 (${firstRepo.name})...`);
  let branchHint = "\u5DF2\u5237\u65B0\u8FDC\u7AEF\u5206\u652F";
  try {
    await fetchAll(firstRepo.path);
  } catch {
    branchHint = "\u8FDC\u7AEF\u5237\u65B0\u5931\u8D25\uFF0C\u4F7F\u7528\u672C\u5730\u7F13\u5B58";
  }
  const branches = await getBranches(firstRepo.path);
  sf.stop(branchHint);
  const branchOptions = [
    ...branches.local.map((b) => ({ value: b, label: b, hint: "local" })),
    ...branches.remote.map((b) => ({ value: b, label: b, hint: "remote" })),
    { value: "__custom__", label: "+ \u8F93\u5165\u5206\u652F\u540D" }
  ];
  const selectedBranch = await select({
    message: `\u9009\u62E9\u5206\u652F (\u57FA\u4E8E ${firstRepo.name} \u7684\u5206\u652F\u5217\u8868):`,
    options: branchOptions
  });
  onCancel(selectedBranch);
  let branch;
  if (selectedBranch === "__custom__") {
    const custom = await text({
      message: "\u5206\u652F\u540D:",
      placeholder: "feature/xxx",
      validate: (val) => {
        if (!val) return "\u8BF7\u8F93\u5165\u5206\u652F\u540D";
      }
    });
    onCancel(custom);
    branch = custom;
  } else {
    branch = selectedBranch;
  }
  const defaultTarget = path3.join(
    path3.dirname(resolvedSource),
    `${path3.basename(resolvedSource)}--${branchToDir(branch)}`
  );
  const targetDir = await text({
    message: "worktree \u7EC4\u76EE\u5F55:",
    initialValue: defaultTarget,
    validate: (val) => {
      if (!val) return "\u8BF7\u8F93\u5165\u8DEF\u5F84";
    }
  });
  onCancel(targetDir);
  const resolvedTarget = path3.resolve(targetDir);
  const summary = selectedRepos.map((r) => `  ${r.name}`).join("\n");
  note(
    `${summary}

  \u5206\u652F: ${branch}
  \u76EE\u6807: ${resolvedTarget}`,
    `\u5373\u5C06\u521B\u5EFA ${selectedRepos.length} \u4E2A worktree`
  );
  const confirmed = await confirm({ message: "\u786E\u8BA4\u521B\u5EFA?" });
  onCancel(confirmed);
  if (!confirmed) return;
  const wsRepos = [];
  for (const repo of selectedRepos) {
    const wtPath = path3.join(resolvedTarget, repo.name);
    const s2 = spinner();
    s2.start(`${repo.name} \u2192 ${branch}`);
    try {
      await createWorktree(repo.path, wtPath, branch);
      wsRepos.push({
        name: repo.name,
        sourcePath: repo.path,
        branch,
        worktreePath: wtPath
      });
      s2.stop(`${repo.name} \u2192 ${branch}`);
    } catch (err) {
      s2.stop(`${repo.name} \u5931\u8D25: ${err.message}`);
    }
  }
  if (wsRepos.length > 0) {
    addWorkspace(config, {
      id: generateId(),
      sourceDir: resolvedSource,
      targetDir: resolvedTarget,
      branch,
      repos: wsRepos,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    note(
      wsRepos.map((r) => `  ${r.name}`).join("\n") + `

  cd ${resolvedTarget}`,
      `\u5B8C\u6210 (${wsRepos.length}/${selectedRepos.length} \u6210\u529F)`
    );
  } else {
    log.error("\u6240\u6709\u4ED3\u5E93\u521B\u5EFA\u5931\u8D25");
  }
}

// src/commands/list.ts
import { log as log2, note as note2 } from "@clack/prompts";
import pc from "picocolors";
async function listWorkspaces() {
  const config = loadConfig();
  if (config.workspaces.length === 0) {
    log2.info("\u6CA1\u6709\u6D3B\u8DC3\u7684\u5DE5\u4F5C\u533A\uFF0C\u4F7F\u7528 gwt create \u521B\u5EFA");
    return;
  }
  for (const ws of config.workspaces) {
    const repos = ws.repos.map((r) => `  ${pc.cyan(r.name)} \u2192 ${pc.green(r.worktreePath)}`).join("\n");
    const time = new Date(ws.createdAt).toLocaleString();
    note2(
      `${repos}

  \u521B\u5EFA\u4E8E: ${pc.dim(time)}`,
      `${pc.yellow(ws.branch)} \u2190 ${ws.sourceDir}`
    );
  }
  log2.info(`\u5171 ${config.workspaces.length} \u4E2A\u5DE5\u4F5C\u533A`);
}

// src/commands/remove.ts
import fs3 from "fs";
import { select as select2, confirm as confirm2, spinner as spinner2, log as log3 } from "@clack/prompts";
import pc2 from "picocolors";
async function removeWorkspaceCmd() {
  const config = loadConfig();
  if (config.workspaces.length === 0) {
    log3.info("\u6CA1\u6709\u6D3B\u8DC3\u7684\u5DE5\u4F5C\u533A");
    return;
  }
  const wsId = await select2({
    message: "\u9009\u62E9\u8981\u5220\u9664\u7684\u5DE5\u4F5C\u533A:",
    options: config.workspaces.map((ws2) => ({
      value: ws2.id,
      label: `${ws2.branch} \u2190 ${ws2.sourceDir}`,
      hint: ws2.repos.map((r) => r.name).join(", ")
    }))
  });
  onCancel(wsId);
  const ws = config.workspaces.find((w) => w.id === wsId);
  log3.info(`\u5DE5\u4F5C\u533A: ${ws.targetDir}`);
  log3.info(`\u5206\u652F: ${ws.branch}`);
  for (const repo of ws.repos) {
    log3.message(`  ${repo.name} \u2192 ${repo.worktreePath}`);
  }
  const yes = await confirm2({ message: "\u786E\u8BA4\u5220\u9664? (\u5C06\u79FB\u9664\u6240\u6709 worktree)" });
  onCancel(yes);
  if (!yes) return;
  const s = spinner2();
  for (const repo of ws.repos) {
    s.start(`\u79FB\u9664 ${repo.name}...`);
    try {
      if (fs3.existsSync(repo.worktreePath)) {
        await removeWorktree(repo.sourcePath, repo.worktreePath);
      }
      s.stop(`${pc2.green("ok")} ${repo.name}`);
    } catch (err) {
      s.stop(`${pc2.red("fail")} ${repo.name}: ${err.message}`);
    }
  }
  removeWorkspaceById(config, ws.id);
  try {
    if (fs3.existsSync(ws.targetDir)) {
      const entries = fs3.readdirSync(ws.targetDir);
      if (entries.length === 0) {
        fs3.rmdirSync(ws.targetDir);
        log3.info(`\u5DF2\u6E05\u7406\u7A7A\u76EE\u5F55 ${ws.targetDir}`);
      }
    }
  } catch {
  }
  log3.success("\u5DE5\u4F5C\u533A\u5DF2\u5220\u9664");
}

// src/index.ts
import pc3 from "picocolors";
async function mainMenu() {
  intro(pc3.cyan("Git Worktree Manager"));
  const action = await select3({
    message: "\u9009\u62E9\u64CD\u4F5C:",
    options: [
      { value: "create", label: "\u521B\u5EFA\u5DE5\u4F5C\u533A", hint: "\u626B\u63CF\u76EE\u5F55\uFF0C\u6279\u91CF\u68C0\u51FA worktree" },
      { value: "list", label: "\u67E5\u770B\u5DE5\u4F5C\u533A", hint: "\u5217\u51FA\u6240\u6709\u6D3B\u8DC3\u7684\u5DE5\u4F5C\u533A" },
      { value: "remove", label: "\u5220\u9664\u5DE5\u4F5C\u533A", hint: "\u79FB\u9664 worktree \u5E76\u6E05\u7406" }
    ]
  });
  onCancel(action);
  switch (action) {
    case "create":
      await createWorkspace();
      break;
    case "list":
      await listWorkspaces();
      break;
    case "remove":
      await removeWorkspaceCmd();
      break;
  }
  outro(pc3.dim("done"));
}
var program = new Command();
program.name("gwt").description("Git Worktree Manager - \u591A\u4ED3\u5E93 worktree \u7BA1\u7406\u5DE5\u5177").version("1.0.0").action(mainMenu);
program.command("create").description("\u521B\u5EFA\u5DE5\u4F5C\u533A - \u626B\u63CF\u76EE\u5F55\uFF0C\u6279\u91CF\u68C0\u51FA worktree").action(async () => {
  intro(pc3.cyan("\u521B\u5EFA\u5DE5\u4F5C\u533A"));
  await createWorkspace();
  outro(pc3.dim("done"));
});
program.command("list").description("\u67E5\u770B\u6240\u6709\u6D3B\u8DC3\u5DE5\u4F5C\u533A").action(async () => {
  intro(pc3.cyan("\u5DE5\u4F5C\u533A\u5217\u8868"));
  await listWorkspaces();
  outro(pc3.dim("done"));
});
program.command("remove").description("\u5220\u9664\u5DE5\u4F5C\u533A").action(async () => {
  intro(pc3.cyan("\u5220\u9664\u5DE5\u4F5C\u533A"));
  await removeWorkspaceCmd();
  outro(pc3.dim("done"));
});
program.parse();
