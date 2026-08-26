import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CountUpDirective } from '../../directives/count-up.directive';

/** One hero stat — `<app-stat-counter [to]="30" label="projects shipped" />`.
 * Counts up on first view via `CountUpDirective`; renders the final number
 * immediately under `prefers-reduced-motion` or during SSR. */
@Component({
  selector: 'app-stat-counter',
  standalone: true,
  imports: [CountUpDirective],
  templateUrl: './stat-counter.component.html',
  styleUrl: './stat-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCounterComponent {
  @Input({ required: true }) to!: number;
  @Input() suffix = '';
  @Input({ required: true }) label!: string;
}
