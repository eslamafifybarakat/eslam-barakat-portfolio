import { TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  it('references the matching sprite symbol via <use>, and flips only when directional', async () => {
    await TestBed.configureTestingModule({ imports: [IconComponent] }).compileComponents();
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'external');
    fixture.detectChanges();

    const use = fixture.nativeElement.querySelector('use');
    expect(use.getAttribute('href')).toBe('#icon-external');
    expect(fixture.nativeElement.querySelector('svg').classList.contains('i--dir')).toBe(false);

    fixture.componentRef.setInput('directional', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg').classList.contains('i--dir')).toBe(true);
  });
});
