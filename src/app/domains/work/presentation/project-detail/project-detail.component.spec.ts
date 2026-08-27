import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProjectDetailComponent } from './project-detail.component';

describe('ProjectDetailComponent', () => {
  async function setup(slug: string) {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ slug }) },
            paramMap: of(convertToParamMap({ slug })),
          },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProjectDetailComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('opens the modal with the matching project title', async () => {
    const fixture = await setup('agro-teba');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.modal.is-open')).toBeTruthy();
    expect(el.querySelector('#modal-title-0, h3')?.textContent).toContain('AGRO TEBA');
  });

  it('shows an infrastructure note when the project has one', async () => {
    const fixture = await setup('knowledge-bank-tweeq');
    expect(fixture.nativeElement.querySelector('.note')?.textContent).toContain('Server changed');
  });

  it('omits the note for a project without one', async () => {
    const fixture = await setup('agro-teba');
    expect(fixture.nativeElement.querySelector('.note')).toBeNull();
  });
});
