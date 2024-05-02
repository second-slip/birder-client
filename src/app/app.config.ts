import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { authenticationInterceptor } from './_httpInterceptors/authentication.interceptor';
import { errorInterceptor } from './_httpInterceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({scrollPositionRestoration: 'top'})),
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
    { provide: LOCALE_ID, useValue: 'en-GB' },
    provideHttpClient(withInterceptors([authenticationInterceptor, errorInterceptor])),
    provideAnimations()
  ]
};