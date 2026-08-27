import { TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  it('renders 3 about paragraphs and 4 pillars', async () => {
    await TestBed.configureTestingModule({ imports: [AboutComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.prose > div').length).toBe(3);
    expect(el.querySelectorAll('.pillar').length).toBe(4);
    expect(el.querySelector('.prose strong')?.textContent).toContain('Senior Angular Frontend Developer');
  });
});
