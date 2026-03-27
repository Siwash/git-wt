const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseCSS = fs.readFileSync(path.join(__dirname, 'terminal.html'), 'utf-8');
const styleMatch = baseCSS.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch[1];

const screens = [
  {
    name: 'gwt-help',
    title: 'Terminal — gwt --help',
    html: `
<span class="prompt">❯</span> <span class="cmd">gwt --help</span>

<span class="white">Usage: gwt [options] [command]</span>

<span class="dim">Git Worktree Manager - 多仓库 worktree 管理工具</span>

<span class="white">Options:</span>
  <span class="cyan">-V, --version</span>  <span class="dim">output the version number</span>
  <span class="cyan">-h, --help</span>     <span class="dim">display help for command</span>

<span class="white">Commands:</span>
  <span class="cyan">create</span>         <span class="dim">创建工作区 - 扫描目录，批量检出 worktree</span>
  <span class="cyan">list</span>           <span class="dim">查看所有活跃工作区</span>
  <span class="cyan">remove</span>         <span class="dim">删除工作区</span>
`
  },
  {
    name: 'gwt-create',
    title: 'Terminal — gwt create',
    html: `
<span class="prompt">❯</span> <span class="cmd">gwt create</span>

<span class="bar">│</span>
<span class="magenta">◆</span>  <span class="bold white">项目所在目录 (包含多个 git 仓库的文件夹):</span>
<span class="bar">│</span>  <span class="cyan">D:\\code\\AI-coding</span>
<span class="bar">│</span>
<span class="green">◇</span>  <span class="dim">发现 30 个 git 仓库</span>
<span class="bar">│</span>
<span class="magenta">◆</span>  <span class="bold white">选择要创建 worktree 的项目:</span>
<span class="bar">│</span>  <span class="checkbox">◼</span> <span class="selected">comi-api</span>
<span class="bar">│</span>  <span class="checkbox">◼</span> <span class="selected">comi-biz</span>
<span class="bar">│</span>  <span class="checkbox">◼</span> <span class="selected">cap-agent</span>
<span class="bar">│</span>  <span class="dim">◻ comi-web</span>
<span class="bar">│</span>  <span class="dim">◻ shared-utils</span>
<span class="bar">│</span>  <span class="dim">  ↑/↓ 切换  ·  空格 选择  ·  a 全选  ·  回车 确认</span>
<span class="bar">│</span>
<span class="green">◇</span>  <span class="dim">已刷新远端分支</span>
<span class="bar">│</span>
<span class="magenta">◆</span>  <span class="bold white">选择分支 (基于 comi-api 的分支列表):</span>
<span class="bar">│</span>  <span class="radio">●</span> <span class="selected">standard-V10.x-develop</span>  <span class="dim">local</span>
<span class="bar">│</span>  <span class="dim">○ main</span>  <span class="dim">local</span>
<span class="bar">│</span>  <span class="dim">○ feature/new-ui</span>  <span class="dim">remote</span>
<span class="bar">│</span>  <span class="dim">○ + 输入分支名</span>
<span class="bar">│</span>
<span class="magenta">◆</span>  <span class="bold white">worktree 组目录:</span>
<span class="bar">│</span>  <span class="cyan">D:\\code\\AI-coding--standard-V10.x-develop</span>
<span class="bar">│</span>
`
  },
  {
    name: 'gwt-result',
    title: 'Terminal — gwt create (result)',
    html: `
<span class="bar">│</span>
<span class="blue">┌</span>  <span class="bold white">即将创建 3 个 worktree</span>
<span class="blue">│</span>  <span class="white">  comi-api</span>
<span class="blue">│</span>  <span class="white">  comi-biz</span>
<span class="blue">│</span>  <span class="white">  cap-agent</span>
<span class="blue">│</span>
<span class="blue">│</span>  <span class="white">  分支: </span><span class="cyan">standard-V10.x-develop</span>
<span class="blue">│</span>  <span class="white">  目标: </span><span class="cyan">D:\\code\\AI-coding--standard-V10.x-develop</span>
<span class="blue">└</span>
<span class="bar">│</span>
<span class="magenta">◆</span>  <span class="bold white">确认创建?</span>
<span class="bar">│</span>  <span class="selected">Yes</span> / <span class="dim">No</span>
<span class="bar">│</span>
<span class="green">◇</span>  <span class="white">comi-api → standard-V10.x-develop</span>
<span class="green">◇</span>  <span class="white">comi-biz → standard-V10.x-develop</span>
<span class="green">◇</span>  <span class="white">cap-agent → standard-V10.x-develop</span>
<span class="bar">│</span>
<span class="blue">┌</span>  <span class="bold green">完成 (3/3 成功)</span>
<span class="blue">│</span>  <span class="white">  comi-api</span>
<span class="blue">│</span>  <span class="white">  comi-biz</span>
<span class="blue">│</span>  <span class="white">  cap-agent</span>
<span class="blue">│</span>
<span class="blue">│</span>  <span class="white">  cd </span><span class="cyan">D:\\code\\AI-coding--standard-V10.x-develop</span>
<span class="blue">└</span>
`
  },
  {
    name: 'gwt-menu',
    title: 'Terminal — gwt',
    html: `
<span class="prompt">❯</span> <span class="cmd">gwt</span>

<span class="bar">│</span>
<span class="green bold">◆</span>  <span class="bold white">gwt — Git Worktree Manager</span>
<span class="bar">│</span>
<span class="magenta">◆</span>  <span class="bold white">选择操作:</span>
<span class="bar">│</span>  <span class="radio">●</span> <span class="selected">创建工作区</span>    <span class="dim">扫描目录，批量检出 worktree</span>
<span class="bar">│</span>  <span class="dim">○ 查看工作区</span>    <span class="dim">列出所有活跃工作区</span>
<span class="bar">│</span>  <span class="dim">○ 删除工作区</span>    <span class="dim">清理不再需要的 worktree</span>
<span class="bar">│</span>  <span class="dim">○ 退出</span>
<span class="bar">│</span>
`
  }
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 2 });

  for (const screen of screens) {
    const page = await context.newPage();
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><style>${css}</style></head>
<body>
<div class="terminal">
  <div class="titlebar">
    <div class="dot dot-red"></div>
    <div class="dot dot-yellow"></div>
    <div class="dot dot-green"></div>
    <div class="titlebar-text">${screen.title}</div>
  </div>
  <div class="content">${screen.html}</div>
</div>
</body>
</html>`;

    await page.setContent(fullHTML);
    const terminal = await page.$('.terminal');
    await terminal.screenshot({
      path: path.join(__dirname, `${screen.name}.png`),
      omitBackground: true,
    });
    console.log(`✓ ${screen.name}.png`);
    await page.close();
  }

  await browser.close();
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
