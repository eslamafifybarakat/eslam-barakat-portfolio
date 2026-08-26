import { TestBed } from '@angular/core/testing';
import { SectionHeadComponent } from './section-head.component';

describe('SectionHeadComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SectionHeadComponent] }).compileComponents();
  });

  it('renders the eyebrow, heading and an optional lede', () => {
    const fixture = TestBed.createComponent(SectionHeadComponent);
    fixture.componentRef.setInput('eyebrow', 'Stack');
    fixture.componentRef.setInput('heading', 'What I work with');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2.sec-t')?.textContent).toBe('What I work with');
    expect(el.querySelector('.sec-lede')).toBeNull();

    fixture.componentRef.setInput('lede', 'Grouped the way I actually use it.');
    fixture.detectChanges();
    expect(el.querySelector('.sec-lede')?.textContent).toBe('Grouped the way I actually use it.');
  });
});
