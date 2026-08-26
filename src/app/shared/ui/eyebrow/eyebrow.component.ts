import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The small accent-colored label-with-a-tick-mark above every section
 * heading — `<app-eyebrow>Summary</app-eyebrow>`. */
@Component({
  selector: 'app-eyebrow',
  standalone: true,
  templateUrl: './eyebrow.component.html',
  styleUrl: './eyebrow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EyebrowComponent {}
