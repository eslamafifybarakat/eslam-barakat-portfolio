import { TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SkeletonComponent] }).compileComponents();
  });

  it('renders a real, non-zero-height shape for every variant', () => {
    const fixture = TestBed.createComponent(SkeletonComponent);
    fixture.componentRef.setInput('variant', 'card');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sk-card')).toBeTruthy();
  });

  it('renders `lines` list rows for variant="list"', () => {
    const fixture = TestBed.createComponent(SkeletonComponent);
    fixture.componentRef.setInput('variant', 'list');
    fixture.componentRef.setInput('lines', 4);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.sk-list .sk').length).toBe(4);
  });
});
