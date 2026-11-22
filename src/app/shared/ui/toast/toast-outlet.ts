import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';
import { ToastService } from './toast.service';

/**
 * Renders toasts from ToastService in a polite live region (top right on desktop,
 * bottom on mobile). Place once in the app shell.
 */
@Component({
  selector: 'app-toast-outlet',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-outlet.html',
  styleUrl: './toast-outlet.scss',
})
export class ToastOutlet {
  protected readonly service = inject(ToastService);
}
