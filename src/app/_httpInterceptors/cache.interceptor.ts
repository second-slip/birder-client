import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { RequestCache } from '../_sharedServices/request-cache.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // return next(req);
  const cache = inject(RequestCache);
  const handler = inject(HttpHandler); // ?????????????????????????????????

  console.log(req);
  console.log('isCacheble: ' + isCachable(req))
  // continue if not cachable.
  if (!isCachable(req)) { return next(req); }

  const cachedResponse = cache.get(req);
  // cache-then-refresh
  if (req.headers.get('x-refresh')) {
    const results$ = sendRequest(req, handler, cache);
    return cachedResponse ?
      results$.pipe(startWith(cachedResponse)) :
      results$;
  }
  // cache-or-fetch
  return cachedResponse ?
    of(cachedResponse) : sendRequest(req, handler, cache);
}







/** Is this request cachable? */
function isCachable(request: HttpRequest<any>): boolean {
  return request.method === 'GET'
    && -1 < request.url.indexOf('api/observationfeed');
    // && -1 < request.url.indexOf('api/observationread') 
    // && -1 < request.url.indexOf('api/observationanalysis')   // do not cache requests containing 'api/observationAnalysis'
    // && -1 < request.url.indexOf('api/list/top') 
    // && -1 < request.url.indexOf('api/userprofile') 
    // && -1 < request.url.indexOf('api/network') 
    // && -1 < request.url.indexOf('api/manage') 
    // && -1 < request.url.indexOf('api/account/check-username') ;
}

/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
function sendRequest(
  request: HttpRequest<any>,
  next: HttpHandler,
  cache: RequestCache): Observable<HttpEvent<any>> {

  // No headers allowed in npm search request
  // const noHeaderReq = request.clone({ headers: new HttpHeaders() });

  return next.handle(request).pipe(
    tap(event => {
      // There may be other events besides the response.
      if (event instanceof HttpResponse) {
        cache.put(request, event); // Update the cache.
      }
    })
  );
}