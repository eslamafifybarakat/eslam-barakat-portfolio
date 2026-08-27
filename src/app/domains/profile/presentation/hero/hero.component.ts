import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { SpecListComponent } from '../../../../shared/ui/spec-list/spec-list.component';
import { StatCounterComponent } from '../../../../shared/ui/stat-counter/stat-counter.component';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ProfileService } from '../../application/profile.service';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { ConfigService } from '../../../../core/config/config.service';

/** The one-page hero — name, role, lede, primary/secondary CTAs, portrait
 * panel with spec sheet and stat counters. The portrait is the page's LCP
 * element: `NgOptimizedImage` with `priority`, never lazy-loaded. */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ButtonComponent,
    SpecListComponent,
    StatCounterComponent,
    RevealOnScrollDirective,
    TranslatePipe,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private readonly document = inject(DOCUMENT);
  private readonly profileService = inject(ProfileService);
  private readonly translation = inject(TranslationService);
  private readonly config = inject(ConfigService);

  protected readonly stats = computed(() => this.profileService.profile().stats);
  protected readonly cvHref = computed(() => `/${this.config.config().cvFileName}`);
  protected readonly email = computed(() => this.config.config().contact.email);

  protected readonly specItems = computed(() => [
    { label: this.translation.translate('portfolio_hero_spec_role_label'), value: this.translation.translate('portfolio_hero_spec_role_value') },
    { label: this.translation.translate('portfolio_hero_spec_base_label'), value: this.translation.translate('portfolio_hero_spec_base_value') },
    { label: this.translation.translate('portfolio_hero_spec_since_label'), value: this.translation.translate('portfolio_hero_spec_since_value') },
    { label: this.translation.translate('portfolio_hero_spec_focus_label'), value: this.translation.translate('portfolio_hero_spec_focus_value') },
    { label: this.translation.translate('portfolio_hero_spec_langs_label'), value: this.translation.translate('portfolio_hero_spec_langs_value') },
  ]);

  goToWork(event: Event): void {
    event.preventDefault();
    this.document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      this.document.querySelector<HTMLElement>('.fchip')?.focus({ preventScroll: true });
    }, 700);
  }
}
