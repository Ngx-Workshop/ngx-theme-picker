import { Component, signal } from '@angular/core';
import { NgxThemePicker } from 'ngx-theme-picker';

@Component({
  selector: 'app-root',
  imports: [NgxThemePicker],
  template: `
    <h1>{{ title() }}</h1>
    <p>Welcome to the ngx-theme-picker demo application!</p>
    <p>
      This application demonstrates the usage of the
      <a
        href="https://www.npmjs.com/package/ngx-theme-picker"
        target="_blank"
        >ngx-theme-picker</a
      >
      library.
    </p>
    <ngx-theme-picker></ngx-theme-picker>
    <p>
      Use the theme picker button in the top-right corner to change
      themes.
    </p>
  `,
  styles: [
    `
      :host {
        padding: 16px;
      }
    `,
  ],
})
export class App {
  protected readonly title = signal('ngx-theme-picker-demo');
}
