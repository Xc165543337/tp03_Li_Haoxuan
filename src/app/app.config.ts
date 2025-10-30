import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { MOCK_BACKEND_PROVIDER } from './backend/mock-backend.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // register the HttpClient and mock backend interceptor
    // allow class-based HttpInterceptor DI registrations to be used by HttpClient
    provideHttpClient(withInterceptorsFromDi()),
    MOCK_BACKEND_PROVIDER,
  ],
}
