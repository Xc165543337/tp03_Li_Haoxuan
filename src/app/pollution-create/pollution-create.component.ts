import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { PollutionFormComponent } from '../pollution-form/pollution-form.component'
import { RefreshService } from '../refresh.service'
import { PollutionService } from '../services/pollution.service'
import { ToastService } from '../toast.service'

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

  onSubmitted(payload: any) {
    this.loading = true
    this.service.create(payload).subscribe(
      () => {
        this.loading = false
        this.toast.success('Pollution enregistrée')
        this.refresh.refresh()
        this.router.navigate([''])
      },
      err => {
        console.error('Error creating pollution', err)
        this.loading = false
        this.toast.error("Impossible d'enregistrer la pollution")
      }
    )
  }
}
