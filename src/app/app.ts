import { CommonModule } from '@angular/common'
import { Component, signal } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'
import { PollutionDeclaration } from './models/pollution.model'
// Pollution form and recap are standalone components used by routes; not imported at root
import { ToastContainerComponent } from './toast/toast-container.component'

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected readonly title = signal('TP3 - Déclaration de Pollution')
  showForm = signal(true)
  declaration = signal<PollutionDeclaration | null>(null)

  constructor() {
    // Ensure example data exists for the mock backend (localStorage key used by interceptor)
    try {
      const key = 'mock_pollutions'
      if (!localStorage.getItem(key)) {
        const demo = [
          {
            id: 1,
            titre: 'Déversement d’huile près du ruisseau',
            type: 'Chimique',
            description: 'Taches huileuses visibles sur le courant.',
            dateObservation: '2025-10-20',
            lieu: 'Rivière des Prés',
            latitude: 48.8566,
            longitude: 2.3522,
          },
          {
            id: 2,
            titre: 'Accumulation de plastique sur la plage',
            type: 'Plastique',
            description: 'Sacs et bouteilles le long du rivage.',
            dateObservation: '2025-09-15',
            lieu: 'Plage du Nord',
            latitude: 43.2965,
            longitude: 5.3698,
          },
          {
            id: 3,
            titre: 'Mauvaise odeur industrielle',
            type: 'Air',
            description: 'Forte odeur chimique près de l’usine.',
            dateObservation: '2025-10-01',
            lieu: 'Zone Industrielle',
            latitude: 45.764,
            longitude: 4.8357,
          },
        ]
        localStorage.setItem(key, JSON.stringify(demo))
      }
    } catch {
      // ignore localStorage errors
    }
  }

  onFormSubmitted(declaration: PollutionDeclaration): void {
    this.declaration.set(declaration)
    this.showForm.set(false)
  }

  resetForm(): void {
    this.declaration.set(null)
    this.showForm.set(true)
  }
}
