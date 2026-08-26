import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EyebrowComponent } from '../eyebrow/eyebrow.component';

/** The sticky eyebrow + `h2` + optional lede column of every editorial
 * section (`.sec__head` in the reference). Text is passed pre-translated so
 * this stays a dumb presentation primitive. */
@Component({
  selector: 'app-section-head',
  standalone: true,
  imports: [EyebrowComponent],
  templateUrl: './section-head.component.html',
  styleUrl: './section-head.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadComponent {
  @Input({ required: true }) eyebrow!: string;
  @Input({ required: true }) heading!: string;
  @Input() lede?: string;
}
