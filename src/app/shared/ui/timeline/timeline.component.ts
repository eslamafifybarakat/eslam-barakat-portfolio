import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import type { TimelineItemView } from './timeline.model';

/** One career-timeline entry (`.job` in the reference) — company, role,
 * period, an optional site link, and the achievement bullets. */
@Component({
  selector: 'app-timeline-item',
  standalone: true,
  imports: [IconComponent, SafeHtmlPipe, RevealOnScrollDirective],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
})
export class TimelineItemComponent {
  @Input({ required: true }) item!: TimelineItemView;
  /** Set by the caller (it knows its own array index) — `:last-child`
   * can't be relied on here since each item renders inside its own
   * `display: contents` host, one DOM level below the shared `.tl` list. */
  @Input() last = false;
}
