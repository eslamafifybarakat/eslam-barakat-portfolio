import { TestBed } from '@angular/core/testing';
import { StatCounterComponent } from './stat-counter.component';

describe('StatCounterComponent', () => {
  it('renders the label and starts from 0 until it scrolls into view', async () => {
    await TestBed.configureTestingModule({ imports: [StatCounterComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatCounterComponent);
    fixture.componentRef.setInput('to', 30);
    fixture.componentRef.setInput('suffix', '+');
    fixture.componentRef.setInput('label', 'projects shipped');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('b').textContent).toBe('0');
    expect(fixture.nativeElement.querySelector('span').textContent).toBe('projects shipped');
  });
});
