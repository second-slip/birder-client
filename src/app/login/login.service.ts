import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

    // move to separate service..........
  // public login(viewModel: Ilogin): Observable<IauthenticationResult> {
  //   return this._http.post<any>('api/Authentication/login', viewModel, httpOptions)
  //     .pipe(tap(response => this._setAuthenticationToken(response)));
  //  call GetAuthStatus on success...
  // }
}
