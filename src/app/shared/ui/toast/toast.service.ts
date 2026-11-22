import { Injectable, signal } from '@angular/core';

export interface ToastAction {
  label: string;
  /** Router link for the action, e.g. '/cart'. */
  link: string;
}

export interface ToastInput {
  title: string;
  message?: string;
  /** Small cover image shown on the left (e.g. the book just added). */
  imageSrc?: string;
  action?: ToastAction;
  /** Milliseconds before auto-dismiss. 0 keeps it until dismissed. Default 5000. */
  duration?: number;
}

export interface Toast extends ToastInput {
  id: number;
}

/** Shows transient notices such as "Added to cart". Render them with <app-toast-outlet>. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly _toasts = signal<readonly Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(input: ToastInput): number {
    const toast: Toast = { duration: 5000, ...input, id: this.nextId++ };
    // Newest first; keep at most three on screen.
    this._toasts.update((list) => [toast, ...list].slice(0, 3));
    if (toast.duration) {
      this.timers.set(
        toast.id,
        setTimeout(() => this.dismiss(toast.id), toast.duration),
      );
    }
    return toast.id;
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    for (const t of this.timers.values()) clearTimeout(t);
    this.timers.clear();
    this._toasts.set([]);
  }
}
