import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { SpecItem } from './spec-list.model';

/** The hero panel's mono spec sheet (Role/Base/Since/Focus/Languages) —
 * `<app-spec-list [items]="items" />`. */
@Component({
  selector: 'app-spec-list',
  standalone: true,
  templateUrl: './spec-list.component.html',
  styleUrl: './spec-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecListComponent {
  @Input({ required: true }) items!: SpecItem[];
}
