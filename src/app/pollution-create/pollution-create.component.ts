import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { PollutionDeclaration } from '../models/pollution.model'
import { PollutionFormComponent } from '../pollution-form/pollution-form.component'
import { PollutionService } from '../services/pollution.service'
import { RefreshService } from '../services/refresh.service'
import { ToastService } from '../services/toast.service'

@Component({
  selector: 'app-pollution-create',
  standalone: true,
  imports: [CommonModule, PollutionFormComponent],
  template: `<div>
    <h2>Nouvelle déclaration</h2>
    <app-pollution-form (formSubmitted)="onSubmitted($event)"></app-pollution-form>
  </div>`,
})
export class PollutionCreateComponent {
  private readonly service = inject(PollutionService)
  private readonly router = inject(Router)
  private readonly toast = inject(ToastService)
  private readonly refresh = inject(RefreshService)

  loading = false

  onSubmitted(payload: PollutionDeclaration) {
    this.loading = true
    this.service.create(payload).subscribe({
      next: () => {
        this.loading = false
        this.toast.success('Pollution enregistrée')
        this.refresh.refresh()
        this.router.navigate([''])
      },
      error: err => {
        console.error('Error creating pollution', err)
        this.loading = false
        this.toast.error("Impossible d'enregistrer la pollution")
      },
    })
  }
}
