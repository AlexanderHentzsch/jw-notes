import {getOptions} from './storage.js';

export const THEMES = ['oled', 'dark', 'light'];
export const DEFAULT_THEME = 'oled';

export function applyTheme(theme) {
  const valid = THEMES.includes(theme) ? theme : DEFAULT_THEME;
  document.documentElement.dataset.theme = valid;
}

export async function initTheme() {
  const options = await getOptions();
  applyTheme(options.theme ?? DEFAULT_THEME);
}
