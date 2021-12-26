import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { IauthenticationResult } from '../iauthentication-result.dto';
import { TokenService } from '../token.service';
import { Ilogin } from './ilogin.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // subscribe in template
  // subscribe until

  constructor(private readonly _http: HttpClient
    , private readonly _token: TokenService
    , private readonly _authService: AuthenticationService) { }

  public login(viewModel: Ilogin): Observable<IauthenticationResult> {
    return this._http.post<any>('api/authentication/login', viewModel, httpOptions)
      .pipe(tap(response => this._handleSuccess(response)))
  }

  private _handleSuccess(response: IauthenticationResult): void {
    console.log(response);
    this._token.addToken(response.authenticationToken);
    this._authService.checkAuthStatus();
  }

  // move to separate service..........
  // public login(viewModel: Ilogin): Observable<IauthenticationResult> {
  //   return this._http.post<any>('api/Authentication/login', viewModel, httpOptions)
  //     .pipe(tap(response => this._setAuthenticationToken(response)));
  //  call GetAuthStatus on success...
  // }


  // setAuthenticationToken(token: AuthenticationResultDto): void {
  //   if (token && token.authenticationToken) {
  //     localStorage.setItem('jwt', token.authenticationToken);
  //     this.isAuthenticated.next(true);
  //   }
  // }
}
