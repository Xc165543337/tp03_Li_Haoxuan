import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { POLLUTION_TYPES } from '../models/pollution.model'
import { PollutionService, PollutionWithId } from '../services/pollution.service'
import { ToastService } from '../toast.service'

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pollution-list.component.html',
  styleUrls: ['./pollution-list.component.less'],
})
export class PollutionListComponent {
  private readonly service = inject(PollutionService)
  private readonly router = inject(Router)

  pollutions: PollutionWithId[] = []
  // filters
  filter = ''
  typeFilter = ''
  dateFrom = ''
  dateTo = ''

  // pagination
  pageSize = 5
  currentPage = 1

  readonly pollutionTypes = POLLUTION_TYPES
  private readonly toast = inject(ToastService)

  constructor() {
    this.load()
  }

  get filtered() {
    const f = this.filter.trim().toLowerCase()
    return this.pollutions.filter(p => {
      if (f) {
        const okText =
          p.titre.toLowerCase().includes(f) ||
          p.type.toLowerCase().includes(f) ||
          p.lieu.toLowerCase().includes(f)
        if (!okText) return false
      }
      if (this.typeFilter && p.type !== this.typeFilter) return false
      if (this.dateFrom && p.dateObservation < this.dateFrom) return false
      if (this.dateTo && p.dateObservation > this.dateTo) return false
      return true
    })
  }

  get pageCount() {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize))
  }

  get paginated() {
    const start = (this.currentPage - 1) * this.pageSize
    return this.filtered.slice(start, start + this.pageSize)
  }

  load(): void {
    this.service.getAll().subscribe(list => (this.pollutions = list))
  }

  viewDetail(id: number): void {
    try {
      // eslint-disable-next-line no-console
      console.log('[PollutionList] navigate to', id)
    } catch {}
    this.router.navigate(['pollution', id])
  }

  viewEdit(id: number): void {
    this.router.navigate(['pollution', id, 'edit'])
  }

  delete(id: number): void {
    if (!confirm('Voulez-vous supprimer cette pollution ?')) return
    this.service.delete(id).subscribe(
      () => {
        this.toast.success('Pollution supprimée')
        // if last item on page was removed, go back a page
        const after = this.filtered.length - 1
        const pagesAfter = Math.max(1, Math.ceil(after / this.pageSize))
        if (this.currentPage > pagesAfter) this.currentPage = pagesAfter
        this.load()
      },
      () => this.toast.error('Erreur lors de la suppression')
    )
  }

  goToPage(n: number) {
    if (n < 1) n = 1
    if (n > this.pageCount) n = this.pageCount
    this.currentPage = n
  }
}
