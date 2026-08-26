import { TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BadgeComponent] }).compileComponents();
  });

  it('adds the flag modifier only when flagship=true', () => {
    const fixture = TestBed.createComponent(BadgeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cap--flag')).toBeNull();

    fixture.componentRef.setInput('flagship', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cap--flag')).toBeTruthy();
  });
});
