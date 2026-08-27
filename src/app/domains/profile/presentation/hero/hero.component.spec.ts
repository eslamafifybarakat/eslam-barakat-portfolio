import { TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  it('renders the name, role and all three CV/portrait/stats elements', async () => {
    await TestBed.configureTestingModule({ imports: [HeroComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Afify');
    expect(el.querySelector('.hero__role')?.textContent).toBe('Senior Angular Frontend Developer');
    expect(el.querySelectorAll('app-stat-counter, [class*="stat"]').length).toBeGreaterThan(0);
    expect(el.querySelector('img[ngSrc], img[src]')).toBeTruthy();
  });
});
