import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CardComponent } from './card.component';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `<app-card [interactive]="true" ariaLabel="AGRO TEBA — Details" (activate)="onActivate()">
    <span card-name>AGRO TEBA</span>
  </app-card>`,
})
class HostComponent {
  activated = false;
  onActivate(): void {
    this.activated = true;
  }
}

describe('CardComponent', () => {
  it('is keyboard-activatable with Enter/Space when interactive', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const article = fixture.nativeElement.querySelector('article.card') as HTMLElement;
    expect(article.getAttribute('tabindex')).toBe('0');
    expect(article.getAttribute('role')).toBe('button');

    article.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(fixture.componentInstance.activated).toBe(true);
  });
});
