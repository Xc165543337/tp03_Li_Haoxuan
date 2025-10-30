import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PollutionDeclaration } from '../models/pollution.model'
import { PollutionFormComponent } from '../pollution-form/pollution-form.component'
import { PollutionRecapComponent } from '../pollution-recap/pollution-recap.component'
import { PollutionService, PollutionWithId } from '../services/pollution.service'
import { RefreshService } from '../services/refresh.service'
import { ToastService } from '../services/toast.service'

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
    // Use console.warn to surface lifecycle messages in devtools
    console.warn('[PollutionDetail] constructor, subscribing to params')
    this.route.paramMap.subscribe({
      next: pm => {
        console.warn('[PollutionDetail] paramMap emission', pm.keys, pm.get('id'))
        const raw = pm.get('id')
        const id = raw ? Number(raw) : Number.NaN
        if (!Number.isNaN(id) && id > 0) {
          this.load(id)
        } else {
          this.pollution.set(null)
        }
      },
      error: err => {
        console.error('[PollutionDetail] paramMap error', err)
      },
    })
  }

  load(id: number): void {
    console.warn('[PollutionDetail] load id', id)
    this.service.getById(id).subscribe({
      next: p => {
        console.warn('[PollutionDetail] loaded', p)
        this.pollution.set(p)
      },
      error: err => {
        console.error('[PollutionDetail] load error', err)
        this.pollution.set(null)
      },
    })
  }

  back(): void {
    this.router.navigate([''])
  }

  delete(): void {
    const id = this.pollution()?.id
    if (!id) return
    if (!confirm('Supprimer cette pollution ?')) return
    this.service.delete(id).subscribe({
      next: () => {
        this.toast.success('Pollution supprimée')
        this.refresh.refresh()
        this.back()
      },
      error: () => this.toast.error('Erreur lors de la suppression'),
    })
  }

  startEdit(): void {
    this.editing = true
  }

  cancelEdit(): void {
    this.editing = false
  }

  submitInlineUpdate(payload: PollutionDeclaration): void {
    const id = this.pollution()?.id
    if (!id) return
    this.updating = true
    this.service.update(id, payload).subscribe({
      next: () => {
        this.updating = false
        this.editing = false
        this.toast.success('Mise à jour enregistrée')
        this.load(id)
      },
      error: () => {
        this.updating = false
        this.toast.error('Erreur lors de la mise à jour')
      },
    })
  }
}
