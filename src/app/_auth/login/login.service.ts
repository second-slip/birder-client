import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { IAuthenticationResult } from '../i-authentication-result.dto';
import { TokenService } from '../token.service';
import { Ilogin } from './ilogin.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly _http: HttpClient
    , private readonly _token: TokenService
    , private readonly _authService: AuthenticationService) { }

  public login(viewModel: Ilogin): Observable<IAuthenticationResult> {
    return this._http.post<any>('api/authentication/login', viewModel, httpOptions)
      .pipe(tap(response => this._handleSuccess(response)))
  }

  private _handleSuccess(response: IAuthenticationResult): void {
    this._token.addToken(response.authenticationToken);
    this._authService.checkAuthStatus();
  }
}