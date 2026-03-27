import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { AppConfig, Workspace } from './types';

const CONFIG_DIR = path.join(os.homedir(), '.gwt');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function defaultConfig(): AppConfig {
  return { workspaces: [] };
}

export function loadConfig(): AppConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return defaultConfig();
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw) as AppConfig;
  } catch {
    return defaultConfig();
  }
}

export function saveConfig(config: AppConfig): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function addWorkspace(config: AppConfig, workspace: Workspace): AppConfig {
  config.workspaces.push(workspace);
  saveConfig(config);
  return config;
}

export function removeWorkspaceById(config: AppConfig, id: string): AppConfig {
  config.workspaces = config.workspaces.filter(w => w.id !== id);
  saveConfig(config);
  return config;
}

export function generateId(): string {
  return `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
