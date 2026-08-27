import { TestBed } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';

describe('AccordionComponent', () => {
  it('toggles aria-expanded and panel visibility on trigger click', async () => {
    await TestBed.configureTestingModule({ imports: [AccordionComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AccordionComponent);
    fixture.componentRef.setInput('title', 'Details');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.accordion__trigger') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('.accordion__panel') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);

    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);
  });
});
