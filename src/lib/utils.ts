import { isCancel, cancel } from '@clack/prompts';

export function onCancel<T>(value: T): asserts value is Exclude<T, symbol> {
  if (isCancel(value)) {
    cancel('已取消');
    process.exit(0);
  }
}
