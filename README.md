# NgxThemePicker

Shared theme picker for `@tmdjr/ngx-workshop-design-system`.

## Host setup

Install the picker and `@tmdjr/ngx-workshop-design-system` (21.0.6 or later).
Include the design system once in the host’s global Sass:

```scss
@use '@tmdjr/ngx-workshop-design-system/theme' as ngx;
@include ngx.theme();
```

Remove Material prebuilt theme styles and the old body palette rules. Remove
scoped `tokens()` / `material-adapter()` declarations that would override the
root’s selected theme. Standalone remotes can include `ngx.theme()` in their
own global styles for standalone use.

Inject `ThemePickerService` in an app initializer to restore the theme before
rendering. `<ngx-theme-picker />` supplies the menu; custom menus can continue
to use `THEMES`, `currentTheme()`, `userSelectedTheme.set(name)` and
`darkMode.set(boolean)`.

| Selection | Light root attribute | Dark root attribute |
| --- | --- | --- |
| Workshop (`neon`) | `light` | `neon` |
| Neutral (`neutral`) | `neutral` | `neutral` |
| Amber (`amber`) | `amber-light` | `amber` |
| Teal (`teal`) | `teal-light` | `teal-dark` |
| NASA (`nasa`) | `nasa-light` | `nasa-dark` |
| Reese’s (`reeses`) | `reeses-light` | `reeses-dark` |

The service sets `data-ngx-theme` on `<html>`, so CDK overlays and federated
remotes inherit the same semantic and Material tokens. Neutral is dark-only;
the built-in picker disables its mode toggle and retains the saved mode for
when a paired theme is selected.

The existing `theme-picker-current-name` and `dark-mode` local-storage keys are
retained. Legacy Material palettes and unknown names reset to Workshop while
preserving the saved mode. A fresh profile starts in Workshop light mode.
Only legacy palette/mode body classes are removed; other body classes survive.

## Validate and release

```bash
npm ci
npm run ngx-theme-picker:build
npm run demo:build
npx ng test ngx-theme-picker --watch=false --browsers=ChromeHeadless
```

The main-branch workflow assigns the published patch version from its run
number. Publish this source change, then install that published version in
`mfe-shell-admin` and update its picker singleton version in `webpack.config.js`.
Keep remote singleton requirements compatible with the chosen version. The
shell migration requires this updated picker; the old published implementation
only writes legacy body classes.
