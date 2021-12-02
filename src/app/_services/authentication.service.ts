import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserViewModel } from './UserViewModel';
import { ReadTokenService } from '../_auth/read-token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private readonly _isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _authenticatedUser$: BehaviorSubject<UserViewModel | null> = new BehaviorSubject<UserViewModel | null>(null);
  //OLD implementation:  isAuthenticated$: Observable<boolean> = this._isAuthenticated$.asObservable();

  constructor(private _token: ReadTokenService) { }

  public get isAuth(): Observable<boolean> {
    return this._isAuthenticated$.asObservable();
  }

  public get getAuthUser(): Observable<UserViewModel | null> {
    return this._authenticatedUser$.asObservable();
  }

  public checkAuthStatus(): void {
    this._checkAuthStatus();
    this._updateUser();
  }
  // checkIsAuthenticated(): boolean {
  //   const token = localStorage.getItem('jwt');

  //   if (token && !this.jwtHelper.isTokenExpired(token)) {
  //     this._isAuthenticated$.next(true);
  //     return true;
  //   } else {
  //     localStorage.removeItem('jwt');
  //     this._isAuthenticated$.next(false);
  //     return false;
  //   }
  // }

  public logout(): void {
    this._token.removeToken();
    this.checkAuthStatus();
  }

  private _checkAuthStatus(): void {
    // const status = this._token.IsTokenValid();
    this._isAuthenticated$.next(this._token.isTokenValid());
  }

  private _updateUser(): void {
    // const user = this._token.GetUser();
    this._authenticatedUser$.next(this._token.GetUser());
  }


  // move to separate service..........
  // public login(viewModel: Ilogin): Observable<IauthenticationResult> {
  //   return this._http.post<any>('api/Authentication/login', viewModel, httpOptions)
  //     .pipe(
  //       tap(response => this._setAuthenticationToken(response)));
  // }
}
