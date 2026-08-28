import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
  });

  it('renders a <button> when no href is given', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button.btn'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('a.btn'))).toBeFalsy();
  });

  it('renders an <a> when href is given, with target/rel when external', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('href', 'https://example.com');
    fixture.componentRef.setInput('external', true);
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('a.btn')).nativeElement as HTMLAnchorElement;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('applies the ghost/sm modifier classes', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('variant', 'ghost');
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLElement;
    expect(btn.classList.contains('btn--ghost')).toBe(true);
    expect(btn.classList.contains('btn--sm')).toBe(true);
  });
});
