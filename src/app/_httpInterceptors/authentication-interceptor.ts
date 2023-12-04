import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { TokenService } from '../_auth/token.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private readonly _token: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (isExcluded(req)) { return next.handle(req); }

    // Get the auth token from the service.
    const authToken = this._token.getToken();

    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // Clone the request and set the new header in one step.
    const authReq = req.clone({ setHeaders: { Authorization: `bearer ${authToken}` } });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}

function isExcluded(request: HttpRequest<any>) {
  return request.method === 'GET' && -1 < request.url.indexOf('maps.google.com/')
    // && request.url.indexOf('maps.google.com/') !== 0
}