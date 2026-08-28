import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SectionHeadComponent } from '@shared/ui/section-head/section-head.component';
import { IconComponent } from '@shared/ui/icon/icon.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { EducationService } from '../../application/education.service';

/** The Schooling section — degree, diploma and languages. */
@Component({
  selector: 'app-education-section',
  standalone: true,
  imports: [SectionHeadComponent, IconComponent, TranslatePipe, RevealOnScrollDirective],
  templateUrl: './education-section.component.html',
  styleUrl: './education-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationSectionComponent {
  private readonly educationService = inject(EducationService);
  protected readonly entries = computed(() => this.educationService.entries());
}
