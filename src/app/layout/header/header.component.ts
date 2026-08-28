import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLockupComponent } from '@shared/ui/brand-lockup/brand-lockup.component';
import { IconButtonComponent } from '@shared/ui/icon-button/icon-button.component';
import { ThemeToggleComponent } from '@shared/ui/theme-toggle/theme-toggle.component';
import { LanguageToggleComponent } from '@shared/ui/language-toggle/language-toggle.component';
import { MobileSheetComponent } from '@shared/ui/mobile-sheet/mobile-sheet.component';
import { LanguageService } from '@core/i18n/language.service';
import { TranslationService } from '@core/i18n/translation.service';
import { SectionSpyService } from '@core/scroll/section-spy.service';
import { ConfigService } from '@core/config/config.service';
import { LANG_URL_PREFIX } from '@core/i18n/i18n.model';
import { NAV_META } from './header.nav';

/** The persistent site header: brand, in-page nav with scroll-spy, theme
 * and language toggles, and the mobile menu burger. Present on every route. */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    BrandLockupComponent,
    IconButtonComponent,
    ThemeToggleComponent,
    LanguageToggleComponent,
    MobileSheetComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly languageService = inject(LanguageService);
  private readonly translation = inject(TranslationService);
  private readonly sectionSpy = inject(SectionSpyService);
  private readonly config = inject(ConfigService);

  protected readonly sheetOpen = signal(false);
  protected readonly activeSection = this.sectionSpy.active;
  protected readonly homePath = computed(() => LANG_URL_PREFIX[this.languageService.lang()] || '/');
  protected readonly contact = computed(() => this.config.config().contact);

  protected readonly navItems = computed(() =>
    NAV_META.map((item) => ({
      id: item.id,
      href: `#${item.id}`,
      label: this.translation.translate(item.translationKey),
      icon: item.icon,
    })),
  );

  protected readonly brandSubtitle = computed(() => this.translation.translate('portfolio_shell_brand_subtitle'));
  protected readonly logoAriaLabel = computed(
    () => `Eslam Afify Barakat — ${this.translation.translate('portfolio_nav_home')}`,
  );
  protected readonly slogan = computed(() => this.translation.translate('portfolio_shell_slogan'));
  protected readonly menuLabel = computed(() => this.translation.translate('portfolio_menu_open'));
  protected readonly closeLabel = computed(() => this.translation.translate('portfolio_menu_close'));
  protected readonly emailLabel = computed(() => this.translation.translate('portfolio_contact_cta_email'));
  protected readonly whatsappLabel = computed(() => this.translation.translate('portfolio_contact_cta_whatsapp'));
  protected readonly primaryNavLabel = computed(() => this.translation.translate('portfolio_nav_primary_label'));
  protected readonly mobileNavLabel = computed(() => this.translation.translate('portfolio_nav_mobile_label'));
}
