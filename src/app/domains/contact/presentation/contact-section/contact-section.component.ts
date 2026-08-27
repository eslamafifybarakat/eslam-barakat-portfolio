import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { EyebrowComponent } from '../../../../shared/ui/eyebrow/eyebrow.component';
import { CopyToClipboardDirective } from '../../../../shared/directives/copy-to-clipboard.directive';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ContactService } from '../../application/contact.service';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { ConfigService } from '../../../../core/config/config.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

/** The Contact section — availability, CTAs and the 6 contact rows. */
@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [IconComponent, ButtonComponent, EyebrowComponent, CopyToClipboardDirective, RevealOnScrollDirective, TranslatePipe],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent {
  protected readonly contactService = inject(ContactService);
  private readonly translation = inject(TranslationService);
  private readonly config = inject(ConfigService);
  private readonly toast = inject(ToastService);

  protected readonly emailHref = computed(() => `mailto:${this.config.config().contact.email}`);
  protected readonly whatsappHref = computed(() => this.config.config().contact.whatsapp);
  protected readonly availability = computed(() => [
    this.translation.translate('portfolio_contact_availability_1'),
    this.translation.translate('portfolio_contact_availability_2'),
    this.translation.translate('portfolio_contact_availability_3'),
  ]);

  onCopied(): void {
    this.toast.show(this.translation.translate('portfolio_contact_email_copied'));
  }

  isExternal(href: string): boolean {
    return href.startsWith('http');
  }
}
