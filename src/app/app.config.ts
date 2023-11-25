import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './_auth/authentication.service';
import { HttpInterceptorProviders } from './_httpInterceptors';
import { RequestCache, RequestCacheWithMap } from './_sharedServices/request-cache.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem("jwt");
          },
          allowedDomains: ['localhost:4200', 'birder20210119224819.azurewebsites.net', 'birderweb.com'],
          disallowedRoutes: ['//localhost:4200/Authentication/Login', '//birder20210119224819.azurewebsites.net/Authentication/Login', '//birderweb.com/Authentication/Login'],
        }
      })),
    AuthenticationService,
    HttpInterceptorProviders,
    { provide: RequestCache, useClass: RequestCacheWithMap },
    { provide: LOCALE_ID, useValue: 'en-GB' },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
};