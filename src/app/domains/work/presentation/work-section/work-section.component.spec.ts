import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { WorkSectionComponent } from './work-section.component';

describe('WorkSectionComponent', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [WorkSectionComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(WorkSectionComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders all 30 projects and the correct count line by default', async () => {
    const fixture = await setup();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-project-card').length).toBe(30);
    expect(el.querySelector('.count')?.textContent).toBe('Showing 30 of 30 projects');
  });

  it('filters to Angular-only projects when the ng chip is selected', async () => {
    const fixture = await setup();
    fixture.componentInstance['workService'].setFilter('ng');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-project-card').length).toBe(18);
  });
});
