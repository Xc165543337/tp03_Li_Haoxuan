export interface PollutionDeclaration {
  titre: string
  type: PollutionType
  description: string
  dateObservation: string
  lieu: string
  latitude: number
  longitude: number
  photoUrl?: string
}

export type PollutionType = 'Plastique' | 'Chimique' | 'Dépôt sauvage' | 'Eau' | 'Air' | 'Autre'

export const POLLUTION_TYPES: PollutionType[] = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
]
