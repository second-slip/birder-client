/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from './authentication-interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { CachingInterceptor } from './cachinginterceptor';

/** Http interceptor providers in outside-in order */
export const HttpInterceptorProviders = [
  //   { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
  //   { provide: HTTP_INTERCEPTORS, useClass: EnsureHttpsInterceptor, multi: true },
  //   { provide: HTTP_INTERCEPTORS, useClass: TrimNameInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true, },
  { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
  //   { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  //   { provide: HTTP_INTERCEPTORS, useClass: UploadInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
];
