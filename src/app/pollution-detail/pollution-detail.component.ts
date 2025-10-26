import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PollutionFormComponent } from '../pollution-form/pollution-form.component'
import { PollutionRecapComponent } from '../pollution-recap/pollution-recap.component'
import { RefreshService } from '../refresh.service'
import { PollutionService, PollutionWithId } from '../services/pollution.service'
import { ToastService } from '../toast.service'

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [CommonModule, PollutionFormComponent, PollutionRecapComponent],
  templateUrl: './pollution-detail.component.html',
  styleUrls: ['./pollution-detail.component.less'],
})
export class PollutionDetailComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  readonly service = inject(PollutionService)
  readonly toast = inject(ToastService)
  private readonly refresh = inject(RefreshService)

  pollution = signal<PollutionWithId | null>(null)
  editing = false
  updating = false

  constructor() {
    // respond to route param changes (works when navigating within SPA and when reusing component)
    // Use console.log (visible) to ensure messages appear in the devtools console
    // eslint-disable-next-line no-console
    console.log('[PollutionDetail] constructor, subscribing to params')
    this.route.paramMap.subscribe(pm => {
      // eslint-disable-next-line no-console
      console.log('[PollutionDetail] paramMap emission', pm.keys, pm.get('id'))
      const raw = pm.get('id')
      const id = raw ? Number(raw) : NaN
      if (!Number.isNaN(id) && id > 0) {
        this.load(id)
      } else {
        this.pollution.set(null)
      }
    })
  }

  load(id: number): void {
    try {
      // eslint-disable-next-line no-console
      console.debug('[PollutionDetail] load id', id)
    } catch {}
    this.service.getById(id).subscribe(
      p => {
        try {
          // eslint-disable-next-line no-console
          console.debug('[PollutionDetail] loaded', p)
        } catch {}
        this.pollution.set(p)
      },
      err => {
        try {
          console.error('[PollutionDetail] load error', err)
        } catch {}
        this.pollution.set(null)
      }
    )
  }

  back(): void {
    this.router.navigate([''])
  }

  delete(): void {
    const id = this.pollution()?.id
    if (!id) return
    if (!confirm('Supprimer cette pollution ?')) return
    this.service.delete(id).subscribe(
      () => {
        this.toast.success('Pollution supprimée')
        this.refresh.refresh()
        this.back()
      },
      () => this.toast.error('Erreur lors de la suppression')
    )
  }

  startEdit(): void {
    this.editing = true
  }

  cancelEdit(): void {
    this.editing = false
  }

  submitInlineUpdate(payload: any): void {
    const id = this.pollution()?.id
    if (!id) return
    this.updating = true
    this.service.update(id, payload).subscribe(
      p => {
        this.updating = false
        this.editing = false
        this.toast.success('Mise à jour enregistrée')
        this.load(id)
      },
      () => {
        this.updating = false
        this.toast.error('Erreur lors de la mise à jour')
      }
    )
  }
}
