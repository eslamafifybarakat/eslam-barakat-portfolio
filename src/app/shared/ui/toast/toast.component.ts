import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  private readonly toast = inject(ToastService);

  protected readonly message = this.toast.message;
  protected readonly isUp = computed(() => this.message() !== null);
}
