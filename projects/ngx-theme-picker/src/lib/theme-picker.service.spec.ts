import { TestBed } from '@angular/core/testing';
import { ThemePickerService } from './theme-picker.service';

describe('ThemePickerService', () => {
  let savedTheme: string | null;
  let savedMode: string | null;
  let savedClasses: string;
  let savedAttribute: string | null;

  beforeEach(() => {
    savedTheme = localStorage.getItem(ThemePickerService.THEME_STRORAGE_KEY);
    savedMode = localStorage.getItem(ThemePickerService.DARK_MODE_STRORAGE_KEY);
    savedClasses = document.body.className;
    savedAttribute = document.documentElement.getAttribute('data-ngx-theme');
    localStorage.removeItem(ThemePickerService.THEME_STRORAGE_KEY);
    localStorage.removeItem(ThemePickerService.DARK_MODE_STRORAGE_KEY);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    for (const [key, value] of [
      [ThemePickerService.THEME_STRORAGE_KEY, savedTheme],
      [ThemePickerService.DARK_MODE_STRORAGE_KEY, savedMode],
    ]) {
      if (value === null) localStorage.removeItem(key!);
      else localStorage.setItem(key!, value!);
    }
    document.body.className = savedClasses;
    if (savedAttribute === null) document.documentElement.removeAttribute('data-ngx-theme');
    else document.documentElement.setAttribute('data-ngx-theme', savedAttribute);
  });

  it('applies Workshop light immediately without a picker subscriber', () => {
    const service = TestBed.inject(ThemePickerService);
    expect(service.currentTheme()).toBe('neon');
    expect(document.documentElement.getAttribute('data-ngx-theme')).toBe('light');
  });

  it('migrates a legacy palette while retaining dark mode and unrelated classes', () => {
    localStorage.setItem(ThemePickerService.THEME_STRORAGE_KEY, 'azure-palette');
    localStorage.setItem(ThemePickerService.DARK_MODE_STRORAGE_KEY, 'true');
    document.body.className = 'app-ready azure-palette dark-mode';
    TestBed.inject(ThemePickerService);
    expect(localStorage.getItem(ThemePickerService.THEME_STRORAGE_KEY)).toBe('neon');
    expect(document.documentElement.getAttribute('data-ngx-theme')).toBe('neon');
    expect(document.body.className).toBe('app-ready');
  });

  it('restores a saved design-system family and mode', () => {
    localStorage.setItem(ThemePickerService.THEME_STRORAGE_KEY, 'nasa');
    localStorage.setItem(ThemePickerService.DARK_MODE_STRORAGE_KEY, 'true');
    TestBed.inject(ThemePickerService);
    expect(document.documentElement.getAttribute('data-ngx-theme')).toBe('nasa-dark');
  });

  it('applies every theme pair and persists mode-only changes', () => {
    const service = TestBed.inject(ThemePickerService);
    for (const theme of ThemePickerService.THEMES) {
      service.userSelectedTheme.set(theme.name);
      for (const dark of [false, true]) {
        service.darkMode.set(dark);
        TestBed.tick();
        expect(document.documentElement.getAttribute('data-ngx-theme'))
          .withContext(`${theme.name}, dark=${dark}`)
          .toBe(dark ? theme.darkTheme : theme.lightTheme);
        expect(localStorage.getItem(ThemePickerService.THEME_STRORAGE_KEY)).toBe(theme.name);
        expect(localStorage.getItem(ThemePickerService.DARK_MODE_STRORAGE_KEY)).toBe(String(dark));
      }
    }
  });

  it('falls back safely for invalid stored and runtime theme names', () => {
    localStorage.setItem(ThemePickerService.THEME_STRORAGE_KEY, 'unknown');
    const service = TestBed.inject(ThemePickerService);
    expect(service.currentTheme()).toBe('neon');
    service.userSelectedTheme.set('not-a-theme');
    TestBed.tick();
    expect(document.documentElement.getAttribute('data-ngx-theme')).toBe('light');
    expect(localStorage.getItem(ThemePickerService.THEME_STRORAGE_KEY)).toBe('neon');
  });
});
