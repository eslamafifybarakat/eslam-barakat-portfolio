import { PROJECTS } from './work.data';

describe('PROJECTS data', () => {
  it('has exactly 30 projects (Appendix B), each with a unique slug and name', () => {
    expect(PROJECTS.length).toBe(30);

    const slugs = PROJECTS.map((p) => p.slug);
    const names = PROJECTS.map((p) => p.name);
    expect(new Set(slugs).size).toBe(30);
    expect(new Set(names).size).toBe(30);
  });

  it('has exactly 4 flagship projects and an 18/12 Angular/JavaScript split', () => {
    expect(PROJECTS.filter((p) => p.flagship).length).toBe(4);
    expect(PROJECTS.filter((p) => p.kind === 'ng').length).toBe(18);
    expect(PROJECTS.filter((p) => p.kind === 'js').length).toBe(12);
  });

  it('every project has at least one live link and a description key', () => {
    for (const project of PROJECTS) {
      expect(project.links.length).toBeGreaterThan(0);
      expect(project.descriptionKey.length).toBeGreaterThan(0);
    }
  });
});
