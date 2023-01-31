import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject } from 'rxjs';
import { IAuthUser } from './i-auth-user.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private readonly _isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _authenticatedUser$: BehaviorSubject<IAuthUser | null> = new BehaviorSubject<IAuthUser | null>(null);

  constructor(private _jwtHelper: JwtHelperService,
    private readonly _token: TokenService,
    private readonly _router: Router) { }

  public get isAuthorisedObservable(): Observable<boolean> {
    return this._isAuthenticated$.asObservable();
  }

  // // to avoid subscription in component, when it is not neccessary/appropriate...
  // public get isAuthorised(): boolean {
  //   return this._isAuthenticated$.value;
  // }

  public get getAuthUser(): Observable<IAuthUser | null> {
    return this._authenticatedUser$.asObservable();
  }

  // This method is used by the route guards
  public isLoggedIn():
    boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {

    if (!this._isValidToken()) {
      return this._router.navigate(['/login']);
    }
    return true;
  }

  public checkAuthStatus(): void {
    this._updateAuthStatus();
    this._updateUser();
  }

  public logout(): void {
    this._token.removeToken();
    this._updateAuthStatus();
    this._updateUser();
  }

  private _updateAuthStatus(): void {
    const status = this._isValidToken();
    this._isAuthenticated$.next(status);
  }

  private _updateUser(): void {
    const user = this._getUser();
    this._authenticatedUser$.next(user);
  }

  private _getUser(): IAuthUser | null {
    const token = this._token.getToken();

    if (token && !this._jwtHelper.isTokenExpired(token)) {

      const tokenDecoded = this._jwtHelper.decodeToken(token);

      const user = <IAuthUser>{
        userName: tokenDecoded.unique_name, //
        avatar: tokenDecoded.ImageUrl,
        defaultLocationLatitude: Number(tokenDecoded.Lat),
        defaultLocationLongitude: Number(tokenDecoded.Lng)
      };

      return user;

    } else {
      return null;
    }
  }

  private _isValidToken(): boolean {
    const token = this._token.getToken();

    if (token && !this._jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      this._token.removeToken();
      return false;
    }
  }
}