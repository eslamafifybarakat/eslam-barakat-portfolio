import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

let instanceCounter = 0;

/** A single collapsible disclosure — `<app-accordion title="...">…</app-accordion>`.
 * Self-contained (each instance owns its own open/closed state); compose
 * several for a full accordion group. */
@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  private readonly instanceId = `accordion-${instanceCounter++}`;
  protected readonly panelId = `${this.instanceId}-panel`;
  protected readonly headerId = `${this.instanceId}-header`;

  @Input({ required: true }) title!: string;
  private readonly _open = signal(false);

  @Input()
  set startOpen(value: boolean) {
    this._open.set(value);
  }

  protected readonly open = this._open.asReadonly();

  toggle(): void {
    this._open.update((v) => !v);
  }
}
