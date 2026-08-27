import { TestBed } from '@angular/core/testing';
import { SkillsSectionComponent } from './skills-section.component';

describe('SkillsSectionComponent', () => {
  it('renders all 7 skill groups with their technology chips', async () => {
    await TestBed.configureTestingModule({ imports: [SkillsSectionComponent] }).compileComponents();
    const fixture = TestBed.createComponent(SkillsSectionComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.skill').length).toBe(7);
    expect(el.querySelector('.skill__k')?.textContent).toContain('Languages & markup');
    expect(el.querySelectorAll('.chip').length).toBeGreaterThan(30);
  });
});
