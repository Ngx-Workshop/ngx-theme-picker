import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

export interface DocsSiteTheme {
  name: string;
  displayName: string;
  color: string;
  lightTheme: string;
  darkTheme: string;
}

@Injectable({ providedIn: 'root' })
export class ThemePickerService {
  static THEME_EXAMPLE_ICON = 'assets/img/theme-demo-icon.svg';
  static DEFAULT_THEME = 'neon';
  // Retain the existing storage keys and public signal API for shared consumers.
  static THEME_STRORAGE_KEY = 'theme-picker-current-name';
  static DARK_MODE_STRORAGE_KEY = 'dark-mode';
  static THEMES: DocsSiteTheme[] = [
    { name: 'neon', displayName: 'Workshop', color: '#27f5ef', lightTheme: 'light', darkTheme: 'neon' },
    { name: 'neutral', displayName: 'Neutral (dark)', color: '#b6c8e0', lightTheme: 'neutral', darkTheme: 'neutral' },
    { name: 'amber', displayName: 'Amber', color: '#ffb547', lightTheme: 'amber-light', darkTheme: 'amber' },
    { name: 'teal', displayName: 'Teal', color: '#24d6ce', lightTheme: 'teal-light', darkTheme: 'teal-dark' },
    { name: 'nasa', displayName: 'NASA', color: '#8bbcff', lightTheme: 'nasa-light', darkTheme: 'nasa-dark' },
    { name: 'reeses', displayName: 'Reese’s', color: '#ff8618', lightTheme: 'reeses-light', darkTheme: 'reeses-dark' },
  ];

  private readonly document = inject(DOCUMENT);
  private readonly storage = this.document.defaultView?.localStorage;
  darkMode = signal(this.storage?.getItem(ThemePickerService.DARK_MODE_STRORAGE_KEY) === 'true');
  userSelectedTheme = signal(
    this.normalizeTheme(this.storage?.getItem(ThemePickerService.THEME_STRORAGE_KEY))
  );
  currentTheme = computed(() => this.normalizeTheme(this.userSelectedTheme()));
  activeTheme = computed(() => {
    const theme = ThemePickerService.THEMES.find(theme => theme.name === this.currentTheme())!;
    return this.darkMode() ? theme.darkTheme : theme.lightTheme;
  });

  constructor() {
    // Apply immediately when the shell initializer injects the service, even before
    // a picker is rendered. The effect also tracks mode changes independently.
    this.setThemeStyleAndLocalStorage(this.currentTheme());
    effect(() => this.setThemeStyleAndLocalStorage(this.currentTheme()));
  }

  setThemeStyleAndLocalStorage(newTheme: string): boolean {
    const name = this.normalizeTheme(newTheme);
    const theme = ThemePickerService.THEMES.find(theme => theme.name === name)!;
    const variant = this.darkMode() ? theme.darkTheme : theme.lightTheme;
    this.document.documentElement.setAttribute('data-ngx-theme', variant);
    // Remove only classes owned by the old picker; preserve unrelated body state.
    for (const className of Array.from(this.document.body.classList)) {
      if (className.endsWith('-palette') || className === 'light-mode' || className === 'dark-mode') {
        this.document.body.classList.remove(className);
      }
    }
    this.storage?.setItem(ThemePickerService.THEME_STRORAGE_KEY, name);
    this.storage?.setItem(ThemePickerService.DARK_MODE_STRORAGE_KEY, String(this.darkMode()));
    return true;
  }

  private normalizeTheme(name: string | null | undefined): string {
    return ThemePickerService.THEMES.some(theme => theme.name === name)
      ? name!
      : ThemePickerService.DEFAULT_THEME;
  }
}
