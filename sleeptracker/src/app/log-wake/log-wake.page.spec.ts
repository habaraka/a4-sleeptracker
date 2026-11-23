import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogWakePage } from './log-wake.page';

describe('LogWakePage', () => {
  let component: LogWakePage;
  let fixture: ComponentFixture<LogWakePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogWakePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
