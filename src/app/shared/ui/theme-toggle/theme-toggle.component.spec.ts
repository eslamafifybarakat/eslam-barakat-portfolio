import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../../core/theme/theme.service';

describe('ThemeToggleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ThemeToggleComponent] }).compileComponents();
  });

  it('describes the NEXT theme, not the current one, and toggles on click', () => {
    const fixture = TestBed.createComponent(ThemeToggleComponent);
    const themeService = TestBed.inject(ThemeService);
    themeService.set('dark');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Switch to light theme');

    button.click();
    fixture.detectChanges();
    expect(themeService.theme()).toBe('light');
  });
});
