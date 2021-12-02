import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IauthUser } from '../_auth/iauth-user.dto';
import { ReadTokenService } from '../_auth/read-token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private readonly _isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _authenticatedUser$: BehaviorSubject<IauthUser | null> = new BehaviorSubject<IauthUser | null>(null);
  // OLD implementation:  isAuthenticated$: Observable<boolean> = this._isAuthenticated$.asObservable();

  constructor(private _token: ReadTokenService) { }

  public get isAuthorisedObservable(): Observable<boolean> {
    return this._isAuthenticated$.asObservable();
  }

  // to avoid subscription in component, when it is not neccessary/appropriate...
  public get isAuthorised(): boolean {
    return this._isAuthenticated$.value;
  }

  public get getAuthUser(): Observable<IauthUser | null> {
    return this._authenticatedUser$.asObservable();
  }

  public checkAuthStatus(): void {
    this._checkAuthStatus();
    this._updateUser();
  }

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
  //     .pipe(tap(response => this._setAuthenticationToken(response)));
  //  call GetAuthStatus on success...
  // }
}
