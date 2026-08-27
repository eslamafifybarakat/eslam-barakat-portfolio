import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  EventEmitter,
  HostListener,
  Input,
  Output,
  effect,
  inject,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ButtonComponent } from '../button/button.component';
import { BrandLockupComponent } from '../brand-lockup/brand-lockup.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import { FocusTrapDirective } from '../../directives/focus-trap.directive';
import type { SheetNavItem } from './mobile-sheet.model';

/**
 * The mobile nav drawer (`.sheet`/`.sheetp` in the reference) — burger
 * toggle target, focus-trapped while open, closes on `Esc`, veil click or
 * its own close button, and locks background scroll.
 */
@Component({
  selector: 'app-mobile-sheet',
  standalone: true,
  imports: [
    IconComponent,
    IconButtonComponent,
    ButtonComponent,
    BrandLockupComponent,
    ThemeToggleComponent,
    LanguageToggleComponent,
    FocusTrapDirective,
  ],
  templateUrl: './mobile-sheet.component.html',
  styleUrl: './mobile-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSheetComponent {
  private readonly document = inject(DOCUMENT);

  @Input() open = false;
  @Output() readonly openChange = new EventEmitter<boolean>();

  @Input({ required: true }) navItems!: readonly SheetNavItem[];
  @Input() activeSection = '';
  @Input({ required: true }) slogan!: string;
  @Input({ required: true }) emailHref!: string;
  @Input({ required: true }) whatsappHref!: string;
  @Input({ required: true }) emailLabel!: string;
  @Input({ required: true }) whatsappLabel!: string;
  @Input({ required: true }) closeLabel!: string;
  @Input({ required: true }) menuLabel!: string;

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.open ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close();
  }

  close(): void {
    this.openChange.emit(false);
  }

  navigate(href: string): void {
    this.close();
    const id = href.replace('#', '');
    setTimeout(() => {
      this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }
}
