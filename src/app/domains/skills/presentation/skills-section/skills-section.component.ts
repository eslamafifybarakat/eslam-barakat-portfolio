import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionHeadComponent } from '@shared/ui/section-head/section-head.component';
import { IconComponent } from '@shared/ui/icon/icon.component';
import { ChipComponent } from '@shared/ui/chip/chip.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { SkillsService } from '../../application/skills.service';

/** The Stack section — the 7 technology groups. */
@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [SectionHeadComponent, IconComponent, ChipComponent, TranslatePipe, RevealOnScrollDirective],
  templateUrl: './skills-section.component.html',
  styleUrl: './skills-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsSectionComponent {
  protected readonly skillsService = inject(SkillsService);
}
