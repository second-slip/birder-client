import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(retry(3),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // client-side error
        // console.log(error);
        errorMessage = `client-side error: ${error.error.message}`;
      } else {
        // server-side error
        errorMessage = `server-side error: ${error.status}\nMessage: ${error.message}`;
      }

      return throwError(() => errorMessage);
    })
  );
};