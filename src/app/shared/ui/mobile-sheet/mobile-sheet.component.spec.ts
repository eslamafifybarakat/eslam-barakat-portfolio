import { TestBed } from '@angular/core/testing';
import { MobileSheetComponent } from './mobile-sheet.component';

describe('MobileSheetComponent', () => {
  async function setup() {
    await TestBed.configureTestingModule({ imports: [MobileSheetComponent] }).compileComponents();
    const fixture = TestBed.createComponent(MobileSheetComponent);
    fixture.componentRef.setInput('navItems', [{ id: 'work', label: 'Work', icon: 'grid', href: '#work' }]);
    fixture.componentRef.setInput('slogan', 'Interfaces that work in both directions');
    fixture.componentRef.setInput('emailHref', 'mailto:eslamafifybarakat@gmail.com');
    fixture.componentRef.setInput('whatsappHref', 'https://wa.me/201016221599');
    fixture.componentRef.setInput('emailLabel', 'Email me');
    fixture.componentRef.setInput('whatsappLabel', 'WhatsApp');
    fixture.componentRef.setInput('closeLabel', 'Close menu');
    fixture.componentRef.setInput('menuLabel', 'Menu');
    return fixture;
  }

  it('emits openChange(false) on Escape while open', async () => {
    const fixture = await setup();
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    let closed = false;
    fixture.componentInstance.openChange.subscribe((v: boolean) => (closed = v === false));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closed).toBe(true);
  });

  it('is hidden from assistive tech and hides its panel until open', async () => {
    const fixture = await setup();
    fixture.detectChanges();
    const sheet = fixture.nativeElement.querySelector('.sheet') as HTMLElement;
    expect(sheet.getAttribute('aria-hidden')).toBe('true');
    expect(sheet.classList.contains('is-open')).toBe(false);
  });
});
