import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxThemePicker } from './ngx-theme-picker';

describe('NgxThemePicker', () => {
  let component: NgxThemePicker;
  let fixture: ComponentFixture<NgxThemePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxThemePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxThemePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
