import { TestBed } from '@angular/core/testing';
import { FilterChipsComponent } from './filter-chips.component';

describe('FilterChipsComponent', () => {
  it('marks the active chip and emits activeChange on click', async () => {
    await TestBed.configureTestingModule({ imports: [FilterChipsComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FilterChipsComponent);
    fixture.componentRef.setInput('options', [
      { key: 'all', label: 'All' },
      { key: 'ng', label: 'Angular' },
    ]);
    fixture.componentRef.setInput('active', 'all');
    let emitted: string | undefined;
    fixture.componentInstance.activeChange.subscribe((k: string) => (emitted = k));
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.fchip');
    expect(buttons[0].classList.contains('is-on')).toBe(true);

    buttons[1].click();
    expect(emitted).toBe('ng');
  });
});
