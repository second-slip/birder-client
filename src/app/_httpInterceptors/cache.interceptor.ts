// import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { startWith, tap } from 'rxjs/operators';
// import { inject } from '@angular/core';
// import { RequestCache } from '../_sharedServices/request-cache.service';

// export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
//   // return next(req);
//   const cache = inject(RequestCache);
//   const handler = inject(HttpHandler); // ?????????????????????????????????

//   // console.log(req);
//   console.log('isCacheble: ' + isCachable(req))
//   // continue if not cachable.
//   if (!isCachable(req)) { return next(req); }

//   const cachedResponse = cache.get(req);
//   // cache-then-refresh
//   if (req.headers.get('x-refresh')) {
//     const results$ = sendRequest(req, handler, cache);
//     return cachedResponse ?
//       results$.pipe(startWith(cachedResponse)) :
//       results$;
//   }
//   // cache-or-fetch
//   return cachedResponse ?
//     of(cachedResponse) : sendRequest(req, handler, cache);
// }

// /** Is this request cachable? */
// function isCachable(request: HttpRequest<any>): boolean {
//   return request.method === 'GET'
//     && -1 < request.url.indexOf('api/observationfeed');
//     // && -1 < request.url.indexOf('api/observationread') 
//     // && -1 < request.url.indexOf('api/observationanalysis')   // do not cache requests containing 'api/observationAnalysis'
//     // && -1 < request.url.indexOf('api/list/top') 
//     // && -1 < request.url.indexOf('api/userprofile') 
//     // && -1 < request.url.indexOf('api/network') 
//     // && -1 < request.url.indexOf('api/manage') 
//     // && -1 < request.url.indexOf('api/account/check-username') ;
// }

/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
// function sendRequest(
//   request: HttpRequest<any>,
//   next: HttpHandler,
//   cache: RequestCache): Observable<HttpEvent<any>> {

//   // No headers allowed in npm search request
//   // const noHeaderReq = request.clone({ headers: new HttpHeaders() });

//   return next.handle(request).pipe(
//     tap(event => {
//       // There may be other events besides the response.
//       if (event instanceof HttpResponse) {
//         cache.put(request, event); // Update the cache.
//       }
//     })
//   );
// }


// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpResponse } from '@angular/common/http';

// export interface RequestCacheEntry {
//   url: string;
//   response: HttpResponse<any>;
//   lastRead: number;
// }

// export abstract class RequestCache {
//   abstract get(req: HttpRequest<any>): HttpResponse<any> | undefined;
//   abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void;
// }

// const maxAge = 30000; // maximum cache age (ms)

// @Injectable()
// export class RequestCacheWithMap implements RequestCache {

//   cache = new Map<string, RequestCacheEntry>();

//   constructor() { }

//   get(req: HttpRequest<any>): HttpResponse<any> | undefined {
//     const url = req.urlWithParams;
//     const cached = this.cache.get(url);

//     if (!cached) {
//       return undefined;
//     }

//     const isExpired = cached.lastRead < (Date.now() - maxAge);
//     const expired = isExpired ? 'expired ' : '';

//     console.log(`Found ${expired}cached response for "${url}".`);

//     return isExpired ? undefined : cached.response;
//   }

//   put(req: HttpRequest<any>, response: HttpResponse<any>): void {
//     const url = req.urlWithParams;

//     console.log(`Caching response from "${url}".`);

//     const entry = { url, response, lastRead: Date.now() };
//     this.cache.set(url, entry);

//     // remove expired cache entries
//     const expired = Date.now() - maxAge;
//     this.cache.forEach(_ => {
//       if (entry.lastRead < expired) {
//         this.cache.delete(entry.url);
//       }
//     });

//     console.log(`Request cache size: ${this.cache.size}.`);
//   }
// }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
