import { TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('renders the current year and the built-by line', async () => {
    await TestBed.configureTestingModule({ imports: [FooterComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(String(new Date().getFullYear()));
    expect(text).toContain('Angular-minded');
  });
});
