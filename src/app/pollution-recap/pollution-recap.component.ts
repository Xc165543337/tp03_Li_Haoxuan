import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PollutionDeclaration } from '../models/pollution.model'

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pollution-recap.component.html',
  styleUrls: ['./pollution-recap.component.less'],
})
export class PollutionRecapComponent {
  @Input() declaration!: PollutionDeclaration

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  formatCoordinates(lat: number, lng: number): string {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}
