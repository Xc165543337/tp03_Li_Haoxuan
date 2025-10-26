import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { PollutionDeclaration } from '../models/pollution.model'

export interface PollutionWithId extends PollutionDeclaration {
  id: number
}

@Injectable({
  providedIn: 'root',
})
export class PollutionService {
  private readonly http = inject(HttpClient)
  private readonly baseUrl = `${environment.apiBaseUrl}/pollutions`

  getAll(): Observable<PollutionWithId[]> {
    // debug
    try {
      // eslint-disable-next-line no-console
      console.debug('[PollutionService] GET', this.baseUrl)
    } catch {}
    return this.http.get<PollutionWithId[]>(this.baseUrl)
  }

  getById(id: number): Observable<PollutionWithId> {
    const url = `${this.baseUrl}/${id}`
    try {
      // eslint-disable-next-line no-console
      console.log('[PollutionService] GET', url)
    } catch {}
    return this.http.get<PollutionWithId>(url)
  }

  create(payload: PollutionDeclaration): Observable<PollutionWithId> {
    return this.http.post<PollutionWithId>(this.baseUrl, payload)
  }

  // alias used by some components in the project
  add(payload: PollutionDeclaration): Observable<PollutionWithId> {
    return this.create(payload)
  }

  update(id: number, payload: PollutionDeclaration): Observable<PollutionWithId> {
    return this.http.put<PollutionWithId>(`${this.baseUrl}/${id}`, payload)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
  }
}
