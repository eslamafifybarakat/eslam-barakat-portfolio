import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LanguageToggleComponent } from './language-toggle.component';

describe('LanguageToggleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageToggleComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows the OTHER language code, not the current one', () => {
    const fixture = TestBed.createComponent(LanguageToggleComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('ع');
  });
});
