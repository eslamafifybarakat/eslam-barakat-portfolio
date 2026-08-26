export type Theme = 'dark' | 'light';

export const DEFAULT_THEME: Theme = 'dark';

export const THEME_STORAGE_KEY = 'eb-portfolio-theme';
export const THEME_COOKIE_KEY = 'eb_theme';

export const THEME_COLOR: Record<Theme, string> = {
  dark: '#071018',
  light: '#FCFBF9',
};

export function isTheme(value: string | null | undefined): value is Theme {
  return value === 'dark' || value === 'light';
}

export function otherTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
