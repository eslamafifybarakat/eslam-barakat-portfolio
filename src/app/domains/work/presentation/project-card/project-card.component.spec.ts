import { TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from './project-card.component';
import type { Project } from '../../domain/project.model';

const PROJECT: Project = {
  slug: 'agro-teba',
  name: 'AGRO TEBA',
  kind: 'ng',
  flagship: true,
  period: { en: 'June 2026', ar: 'يونيو 2026' },
  description: { en: 'Agriculture platform.', ar: 'منصة زراعية.' },
  stack: ['Angular', 'TypeScript'],
  links: ['https://dev.agrotebaint.com/'],
  posterScene: 'agri',
};

describe('ProjectCardComponent', () => {
  it('emits openDetails when activated, and the live link opens in a new tab', async () => {
    await TestBed.configureTestingModule({ imports: [ProjectCardComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ProjectCardComponent);
    fixture.componentRef.setInput('project', PROJECT);
    fixture.detectChanges();

    let opened = false;
    fixture.componentInstance.openDetails.subscribe(() => (opened = true));

    const article = fixture.nativeElement.querySelector('article.card') as HTMLElement;
    article.click();
    expect(opened).toBe(true);

    const liveLink = fixture.nativeElement.querySelector('a.cbtn--go') as HTMLAnchorElement;
    expect(liveLink.getAttribute('target')).toBe('_blank');
    expect(liveLink.getAttribute('href')).toBe('https://dev.agrotebaint.com/');
  });
});
