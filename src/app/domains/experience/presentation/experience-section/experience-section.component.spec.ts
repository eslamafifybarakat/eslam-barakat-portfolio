import { TestBed } from '@angular/core/testing';
import { ExperienceSectionComponent } from './experience-section.component';

describe('ExperienceSectionComponent', () => {
  it('renders the 3 roles in chronological order, most recent first', async () => {
    await TestBed.configureTestingModule({ imports: [ExperienceSectionComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ExperienceSectionComponent);
    fixture.detectChanges();

    const names = Array.from(fixture.nativeElement.querySelectorAll('.job__co')).map(
      (el) => (el as HTMLElement).textContent,
    );
    expect(names.length).toBe(3);
    expect(names[0]).toContain('Talbinah');
    expect(names[2]).toBe('Hashstudio Inc.');
  });
});
