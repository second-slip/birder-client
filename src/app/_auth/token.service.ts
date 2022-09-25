import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IAuthUser } from './i-auth-user.dto';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private _jwtHelper: JwtHelperService) { }

  public isTokenValid(): boolean {
    return this._isValidToken();
  }

  private _isValidToken(): boolean {
    const token = this._getToken();

    if (token && !this._jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      this._removeToken();
      return false;
    }
  }

  public getToken(): string | null {
    return this._getToken();
  }

  private _getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  public removeToken(): void {
    this._removeToken();
  }

  private _removeToken(): void {
    localStorage.removeItem('jwt');
  }

  // ToDo: if token is invalid?
  public addToken(token: string): void { // maybe boolean true (valid token) or false (invalid token)
    if (token && !this._jwtHelper.isTokenExpired(token)) {
      localStorage.setItem('jwt', token);
    }
  }

  public getUser(): IAuthUser | null {
    const token = this._getToken();

    if (token && !this._jwtHelper.isTokenExpired(token)) {

      const tokenDecoded = this._jwtHelper.decodeToken(token);

      return <IAuthUser>{
        userName: tokenDecoded.unique_name, //
        avatar: tokenDecoded.ImageUrl,
        defaultLocationLatitude: Number(tokenDecoded.Lat),
        defaultLocationLongitude: Number(tokenDecoded.Lng)
      };

    } else {
      return null;
    }
  }
}