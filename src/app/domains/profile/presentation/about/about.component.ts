import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SectionHeadComponent } from '@shared/ui/section-head/section-head.component';
import { IconComponent } from '@shared/ui/icon/icon.component';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { ProfileService } from '../../application/profile.service';

/** The Summary section — the three About paragraphs and the four
 * capability pillars. */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SectionHeadComponent, IconComponent, SafeHtmlPipe, RevealOnScrollDirective, TranslatePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly profileService = inject(ProfileService);

  protected readonly aboutParagraphKeys = computed(() => this.profileService.profile().aboutParagraphKeys);
  protected readonly pillars = computed(() => this.profileService.profile().pillars);
}
