import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PollutionDeclaration } from '../models/pollution.model'
import { PollutionFormComponent } from '../pollution-form/pollution-form.component'
import { PollutionService, PollutionWithId } from '../services/pollution.service'
import { RefreshService } from '../services/refresh.service'
import { ToastService } from '../services/toast.service'

@Component({
  selector: 'app-pollution-edit',
  standalone: true,
  imports: [CommonModule, PollutionFormComponent],
  template: `
    <div>
      <h2>Modifier la déclaration</h2>
      <app-pollution-form
        [initial]="pollution"
        submitLabel="Enregistrer"
        (formSubmitted)="onSubmitted($event)"
      ></app-pollution-form>
    </div>
  `,
})
export class PollutionEditComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly service = inject(PollutionService)
  private readonly toast = inject(ToastService)
  private readonly refresh = inject(RefreshService)

  loading = false

  pollution: PollutionWithId | null = null

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (id) this.load(id)
  }

  load(id: number) {
    this.service.getById(id).subscribe({
      next: p => (this.pollution = p),
      error: err => console.error('Error loading pollution', err),
    })
  }

  onSubmitted(payload: PollutionDeclaration) {
    const id = this.pollution?.id
    if (!id) return
    this.loading = true
    this.service.update(id, payload).subscribe({
      next: () => {
        this.loading = false
        this.toast.success('Mise à jour enregistrée')
        this.refresh.refresh()
        this.router.navigate(['pollution', id])
      },
      error: err => {
        console.error('Error updating pollution', err)
        this.loading = false
        this.toast.error('Erreur lors de la mise à jour')
      },
    })
  }
}
