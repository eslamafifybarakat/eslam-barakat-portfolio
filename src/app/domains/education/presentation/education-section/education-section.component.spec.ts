import { TestBed } from '@angular/core/testing';
import { EducationSectionComponent } from './education-section.component';

describe('EducationSectionComponent', () => {
  it('renders all 3 education/language entries', async () => {
    await TestBed.configureTestingModule({ imports: [EducationSectionComponent] }).compileComponents();
    const fixture = TestBed.createComponent(EducationSectionComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.edu__row').length).toBe(3);
  });
});
