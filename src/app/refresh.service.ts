import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private subject = new Subject<void>()
  changes$ = this.subject.asObservable()

  refresh() {
    this.subject.next()
  }
}
