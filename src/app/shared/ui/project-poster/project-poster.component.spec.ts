import { TestBed } from '@angular/core/testing';
import { ProjectPosterComponent } from './project-poster.component';

describe('ProjectPosterComponent', () => {
  it('renders the requested scene and host label, with unique per-instance def ids', async () => {
    await TestBed.configureTestingModule({ imports: [ProjectPosterComponent] }).compileComponents();

    const a = TestBed.createComponent(ProjectPosterComponent);
    a.componentRef.setInput('scene', 'agri');
    a.componentRef.setInput('projectName', 'AGRO TEBA');
    a.componentRef.setInput('hostLabel', 'DEV.AGROTEBAINT.COM');
    a.detectChanges();

    const b = TestBed.createComponent(ProjectPosterComponent);
    b.componentRef.setInput('scene', 'health');
    b.componentRef.setInput('projectName', 'AGRO TEBA 2');
    b.componentRef.setInput('hostLabel', 'X');
    b.detectChanges();

    const patternIdA = a.nativeElement.querySelector('pattern').id;
    const patternIdB = b.nativeElement.querySelector('pattern').id;
    expect(patternIdA).not.toBe(patternIdB);
    expect(a.nativeElement.textContent).toContain('DEV.AGROTEBAINT.COM');
    expect(a.nativeElement.querySelector('svg').getAttribute('aria-label')).toBe('AGRO TEBA');
  });
});
