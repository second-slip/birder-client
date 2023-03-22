import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(3),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          //console.log(error);
          if (error.error instanceof ErrorEvent) {
            // client-side error
            //console.log('client-side error');
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            //console.log('server-side error');
            if (error.error.failureReason) { // type user authentication error...
              //alert(error.error.failureReason);
              return throwError(error.error.failureReason)
            }

            //console.log(error.error);
            if (error.error.includes('an sql server')) {
              errorMessage = error.error;
            } else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
            //console.log(error.message);
          }
          // window.alert(errorMessage);
          return throwError(errorMessage);
        })
      )
  }
}