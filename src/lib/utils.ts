import { isCancel, cancel } from '@clack/prompts';

export function onCancel<T>(value: T): asserts value is Exclude<T, symbol> {
  if (isCancel(value)) {
    cancel('已取消');
    process.exit(0);
  }
}

export { searchSelect, searchMultiselect } from './search-prompt';
export type { SearchOption } from './search-prompt';
