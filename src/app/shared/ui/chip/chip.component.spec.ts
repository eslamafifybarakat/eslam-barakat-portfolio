import { TestBed } from '@angular/core/testing';
import { ChipComponent } from './chip.component';

describe('ChipComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ChipComponent] }).compileComponents();
  });

  it('renders a .chip by default and a .tag when variant="tag"', () => {
    const fixture = TestBed.createComponent(ChipComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.chip')).toBeTruthy();

    fixture.componentRef.setInput('variant', 'tag');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.tag')).toBeTruthy();
  });
});
