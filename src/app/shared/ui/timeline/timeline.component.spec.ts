import { TestBed } from '@angular/core/testing';
import { TimelineItemComponent } from './timeline.component';

describe('TimelineItemComponent', () => {
  it('renders the company, role and bullets, and a site link when given', async () => {
    await TestBed.configureTestingModule({ imports: [TimelineItemComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TimelineItemComponent);
    fixture.componentRef.setInput('item', {
      company: 'Talbinah — تلبينة',
      when: 'May 2025 – Present',
      role: 'Angular Frontend Developer',
      meta: 'Remote · Saudi Arabia',
      site: 'https://talbinah.net/',
      siteHost: 'talbinah.net',
      bullets: ['Built an <strong>SSR-correct SEO layer</strong>.'],
    });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.job__co')?.textContent).toBe('Talbinah — تلبينة');
    expect(el.querySelector('a.act')?.getAttribute('href')).toBe('https://talbinah.net/');
    expect(el.querySelector('li strong')?.textContent).toBe('SSR-correct SEO layer');
  });
});
