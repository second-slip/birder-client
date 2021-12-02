import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IauthenticationResult } from '../_auth/iauthentication-result.dto';
import { Ilogin } from '../_auth/ilogin.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private readonly _isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  isAuthenticated$: Observable<boolean> = this._isAuthenticated$.asObservable();

  constructor(private readonly _http: HttpClient, private jwtHelper: JwtHelperService) { }

  public get isAuth(): Observable<boolean> {
    return this._isAuthenticated$.asObservable();
  }


  public TEMPORARY(): void {
    return;
  }


  public login(viewModel: Ilogin): Observable<IauthenticationResult> {
    return this._http.post<any>('api/Authentication/login', viewModel, httpOptions)
      .pipe(
        tap(response => this._setAuthenticationToken(response)));
  }

  getAuthenticationToken(): string {
    const token = localStorage.getItem('jwt');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return token;
    } else {
      return '';
    }
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this._isAuthenticated$.next(false);
  }

  checkIsAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this._isAuthenticated$.next(true);
      return true;
    } else {
      localStorage.removeItem('jwt');
      this._isAuthenticated$.next(false);
      return false;
    }
  }

  private _setAuthenticationToken(token: IauthenticationResult): void {
    if (token && token.authenticationToken) {
      localStorage.setItem('jwt', token.authenticationToken);
      this._isAuthenticated$.next(true);
    }
  }
}
