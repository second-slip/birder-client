import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { JwtModule } from '@auth0/angular-jwt';
import { RequestCache, RequestCacheWithMap } from './_sharedServices/request-cache.service';
import { authenticationInterceptor } from './_httpInterceptors/authentication.interceptor';
import { errorInterceptor } from './_httpInterceptors/error.interceptor';
import { cacheInterceptor } from './_httpInterceptors/cache.interceptor';
import { CachingInterceptor } from './_httpInterceptors/cachinginterceptor';

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
    { provide: RequestCache, useClass: RequestCacheWithMap },
    { provide: LOCALE_ID, useValue: 'en-GB' },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
    //
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    //
    provideHttpClient(withInterceptorsFromDi(),
      withInterceptors([authenticationInterceptor, errorInterceptor])// cacheInterceptor])
    ),
    provideAnimations()
  ]
};