import { CommonModule } from '@angular/common'
import { Component, OnDestroy, inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { ToastMessage, ToastService } from './toast.service'

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper">
      <div *ngFor="let t of toasts" class="toast" [ngClass]="t.level">
        <div class="text">{{ t.text }}</div>
        <button class="close" (click)="dismiss(t.id)">✕</button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-wrapper {
        position: fixed;
        right: 1rem;
        top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        z-index: 9999;
      }
      .toast {
        min-width: 220px;
        padding: 0.6rem 0.8rem;
        border-radius: 6px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      .toast.success {
        background: #27ae60;
      }
      .toast.error {
        background: #c0392b;
      }
      .toast.info {
        background: #3498db;
      }
      .toast .close {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
      }
    `,
  ],
})
export class ToastContainerComponent implements OnDestroy {
  private readonly svc = inject(ToastService)
  toasts: ToastMessage[] = []
  private sub: Subscription

  constructor() {
    this.sub = this.svc.changes$.subscribe(list => (this.toasts = list))
  }

  dismiss(id: number) {
    this.svc.remove(id)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
