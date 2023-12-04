import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../_auth/token.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService);

  if (isExcluded(req)) { return next(req); }
  // Get the auth token from the service.
  const authToken = token.getToken();

  // Clone the request and set the new header in one step.
  const authReq = req.clone({ setHeaders: { Authorization: `bearer ${authToken}` } });

  // send cloned request with header to the next handler.
  return next(authReq);
};

function isExcluded(request: HttpRequest<any>) {
  return request.method === 'GET'
    && -1 < request.url.indexOf('maps.google.com/') // request.url.indexOf('maps.google.com/') !== 0
}

// legacy class-based interceptor:
// export class AuthenticationInterceptor implements HttpInterceptor {
//   constructor(private readonly _token: TokenService) { }
//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     if (isExcluded(req)) { return next.handle(req); }
//     const authToken = this._token.getToken();
//     const authReq = req.clone({ setHeaders: { Authorization: `bearer ${authToken}` } });
//     return next.handle(authReq);