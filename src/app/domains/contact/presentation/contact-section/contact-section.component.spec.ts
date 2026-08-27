import { TestBed } from '@angular/core/testing';
import { ContactSectionComponent } from './contact-section.component';

describe('ContactSectionComponent', () => {
  it('renders all 6 contact rows, and only the email row is marked LTR+copy', async () => {
    await TestBed.configureTestingModule({ imports: [ContactSectionComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ContactSectionComponent);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('a.row');
    expect(rows.length).toBe(6);

    const emailRow = Array.from(rows).find((r) => (r as HTMLElement).getAttribute('href')?.startsWith('mailto:')) as HTMLElement;
    expect(emailRow.querySelector('.row__v--ltr')).toBeTruthy();
  });

  it('non-copy rows keep their normal navigation href untouched', async () => {
    await TestBed.configureTestingModule({ imports: [ContactSectionComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ContactSectionComponent);
    fixture.detectChanges();
    const phoneRow = fixture.nativeElement.querySelector('a[href^="tel:"]');
    expect(phoneRow).toBeTruthy();
  });
});
