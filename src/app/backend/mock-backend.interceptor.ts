import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { PollutionDeclaration } from '../models/pollution.model'

interface StoredPollution extends PollutionDeclaration {
  id: number
}

const STORAGE_KEY = 'mock_pollutions'

function isCollectionPath(path: string): boolean {
  // matches exact collection path endings like '/pollutions' or '/pollutions/' but NOT '/pollutions/1'
  return /\/pollutions\/?$/.test(path)
}

function loadStore(): StoredPollution[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const init: StoredPollution[] = [
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init))
      return init
    }
    return JSON.parse(raw)
  } catch (e) {
    // If reading/parsing localStorage fails, log and return an empty store

    console.error('[MockBackend] failed to load store', e)
    return []
  }
}

function saveStore(items: StoredPollution[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { url, method } = req

    // debug: log requests the mock backend sees (temporary)
    // use console.warn to satisfy lint rules about allowed console methods
    console.warn('[MockBackend] request', { method, url })

    // only handle our api path (accept plural and singular to tolerate mismatches)
    if (!url.includes('/pollutions') && !url.includes('/pollution')) {
      return next.handle(req)
    }

    // normalize path without query/hash to correctly extract id segment
    let path: string
    try {
      // works for absolute and relative URLs
      path = new URL(url, location.origin).pathname
    } catch (err) {
      // fallback: strip query/hash if URL constructor fails
      console.warn(
        '[MockBackend] URL parsing failed, falling back to raw URL',
        (err as Error)?.message
      )
      path = url.split('?')[0].split('#')[0]
    }
    const segments = path.split('/').filter(Boolean)
    const idSegment = segments.at(-1)
    const id = idSegment ? Number(idSegment) || null : null

    const store = loadStore()

    // small artificial delay to simulate network
    type RespondBody = StoredPollution | StoredPollution[] | { message: string } | null
    const respond = (body: RespondBody, status = 200) =>
      of(new HttpResponse({ status, body })).pipe(delay(300))

    if (method === 'GET' && isCollectionPath(path)) {
      // debug logging

      console.warn('[MockBackend] matched COLLECTION GET ->', { path, storeLength: store.length })
      return respond(store)
    }

    if (method === 'GET' && id) {
      console.warn('[MockBackend] matched ITEM GET ->', { id })
      const item = store.find(s => s.id === id)
      if (!item) return respond({ message: 'Not found' }, 404)
      return respond(item)
    }

    if (method === 'POST' && isCollectionPath(path)) {
      const payload = req.body as PollutionDeclaration
      const nextId = store.length ? Math.max(...store.map(s => s.id)) + 1 : 1
      const created: StoredPollution = { id: nextId, ...payload }
      store.push(created)
      saveStore(store)
      return respond(created, 201)
    }

    if (method === 'PUT' && id) {
      const payload = req.body as PollutionDeclaration
      const idx = store.findIndex(s => s.id === id)
      if (idx === -1) return respond({ message: 'Not found' }, 404)
      store[idx] = { id, ...payload }
      saveStore(store)
      return respond(store[idx])
    }

    if (method === 'DELETE' && id) {
      const idx = store.findIndex(s => s.id === id)
      if (idx === -1) return respond({ message: 'Not found' }, 404)
      store.splice(idx, 1)
      saveStore(store)
      return respond(null, 204)
    }

    // fallback
    return next.handle(req)
  }
}

export const MOCK_BACKEND_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockBackendInterceptor,
  multi: true,
}
