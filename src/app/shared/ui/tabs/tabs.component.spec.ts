import { TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  it('marks the active tab with aria-selected and emits on click', async () => {
    await TestBed.configureTestingModule({ imports: [TabsComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TabsComponent);
    fixture.componentRef.setInput('tabs', [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
    ]);
    fixture.componentRef.setInput('active', 'a');
    let emitted: string | undefined;
    fixture.componentInstance.activeChange.subscribe((k: string) => (emitted = k));
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.tabs__btn');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');

    buttons[1].click();
    expect(emitted).toBe('b');
  });
});
