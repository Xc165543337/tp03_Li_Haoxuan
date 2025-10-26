import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { POLLUTION_TYPES, PollutionDeclaration } from '../models/pollution.model'

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pollution-form.component.html',
  styleUrls: ['./pollution-form.component.less'],
})
export class PollutionFormComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder)

  @Output() formSubmitted = new EventEmitter<PollutionDeclaration>()
  @Input() initial?: PollutionDeclaration | null
  @Input() submitLabel?: string
  @Input() loading = false

  pollutionForm: FormGroup
  pollutionTypes = POLLUTION_TYPES

  constructor() {
    this.pollutionForm = this.formBuilder.group({
      titre: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateObservation: ['', [Validators.required]],
      lieu: ['', [Validators.required]],
      latitude: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
      longitude: ['', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]],
      photoUrl: [''],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initial'] && this.initial) {
      // patch the form with initial values; convert numbers to strings for inputs
      const data = {
        ...this.initial,
        latitude: this.initial.latitude?.toString?.() ?? this.initial.latitude,
        longitude: this.initial.longitude?.toString?.() ?? this.initial.longitude,
      }
      this.pollutionForm.patchValue(data)
    }
  }

  onSubmit(): void {
    // mark fields as touched for validation UX
    this.pollutionForm.markAllAsTouched()

    if (this.pollutionForm.invalid || this.loading) {
      return
    }
    const formData = this.pollutionForm.value
    const declaration: PollutionDeclaration = {
      ...formData,
      latitude: Number.parseFloat(formData.latitude),
      longitude: Number.parseFloat(formData.longitude),
    }
    this.formSubmitted.emit(declaration)
  }

  getFieldError(fieldName: string): string | null {
    const field = this.pollutionForm.get(fieldName)
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return 'Ce champ est requis'
      }
      if (field.errors?.['pattern']) {
        return 'Veuillez entrer un nombre valide'
      }
    }
    return null
  }
}
