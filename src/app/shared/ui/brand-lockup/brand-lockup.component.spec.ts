import { TestBed } from '@angular/core/testing';
import { BrandLockupComponent } from './brand-lockup.component';

describe('BrandLockupComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BrandLockupComponent] }).compileComponents();
  });

  it('renders the 96x96 monogram viewBox by default', () => {
    const fixture = TestBed.createComponent(BrandLockupComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg').getAttribute('viewBox')).toBe('0 0 96 96');
  });

  it('renders the 470x96 full lockup viewBox when variant="full"', () => {
    const fixture = TestBed.createComponent(BrandLockupComponent);
    fixture.componentRef.setInput('variant', 'full');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg').getAttribute('viewBox')).toBe('0 0 470 96');
  });
});
