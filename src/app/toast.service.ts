import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

export type ToastLevel = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  level: ToastLevel
  text: string
  ttl?: number
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 1
  private subject = new Subject<ToastMessage[]>()
  private messages: ToastMessage[] = []

  changes$ = this.subject.asObservable()

  show(text: string, level: ToastLevel = 'info', ttl = 4000) {
    const msg: ToastMessage = { id: this.counter++, level, text, ttl }
    this.messages = [...this.messages, msg]
    this.subject.next(this.messages)
    if (ttl > 0) {
      setTimeout(() => this.remove(msg.id), ttl)
    }
  }

  success(text: string, ttl = 3500) {
    this.show(text, 'success', ttl)
  }

  error(text: string, ttl = 6000) {
    this.show(text, 'error', ttl)
  }

  remove(id: number) {
    this.messages = this.messages.filter(m => m.id !== id)
    this.subject.next(this.messages)
  }

  clear() {
    this.messages = []
    this.subject.next(this.messages)
  }
}
