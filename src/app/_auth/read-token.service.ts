import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../_services/authentication.service';
import { UserViewModel } from '../_services/UserViewModel';

@Injectable({
  providedIn: 'root'
})
export class ReadTokenService {

  constructor(private _jwtHelper: JwtHelperService
    , private _service: AuthenticationService) { }

  public GetFlikrKey(): string {
    const token = localStorage.getItem('jwt');

    if (token && !this._jwtHelper.isTokenExpired(token)) {
      const tokenDecoded = this._jwtHelper.decodeToken(token);
      return tokenDecoded.FlickrKey;
    } else {
      return 'null';
    }
  }

  public GetMapKey(): string {
    const token = localStorage.getItem('jwt');

    if (token && !this._jwtHelper.isTokenExpired(token)) {
      const tokenDecoded = this._jwtHelper.decodeToken(token);
      return tokenDecoded.MapKey;
    } else {
      return 'null';
    }
  }

  public CheckIsRecordOwner(username: string): boolean {
    const token = localStorage.getItem('jwt');

    if (token && !this._jwtHelper.isTokenExpired(token)) {
      // console.log(this.jwtHelper.decodeToken(token));
      const tokenDecoded = this._jwtHelper.decodeToken(token);
      if (tokenDecoded.unique_name === username) {
        return true;
      } else {
        return false;
      }

    } else {
      // TODO: Remove token (could be expired)
      return false;
    }
  }

  public GetAuthenticatedUserDetails() {

    const token = localStorage.getItem('jwt');

    if (token && !this._jwtHelper.isTokenExpired(token)) {
      const tokenDecoded = this._jwtHelper.decodeToken(token);

      return <UserViewModel>{
        userName: tokenDecoded.unique_name,
        avatar: tokenDecoded.ImageUrl,
        defaultLocationLatitude: Number(tokenDecoded.DefaultLatitude),
        defaultLocationLongitude: Number(tokenDecoded.DefaultLongitude)
      };
    } else {
      this._service.logout();
      return;
    }
  }

  public GetUsername(): string {
    const token = localStorage.getItem('jwt');

    if (token && !this._jwtHelper.isTokenExpired(token)) {
      const tokenDecoded = this._jwtHelper.decodeToken(token);
      return tokenDecoded.unique_name;
    } else {
      this._service.logout();
      return 'null';
    }
  }

  // getDefaultLocation() {
  //   const token = localStorage.getItem('jwt');

  //   if (token && !this.jwtHelper.isTokenExpired(token)) {
  //     const tokenDecoded = this.jwtHelper.decodeToken(token);

  //     const model = <SetLocationViewModel>{
  //       defaultLocationLatitude: Number(tokenDecoded.DefaultLatitude),
  //       defaultLocationLongitude: Number(tokenDecoded.DefaultLongitude)
  //     };
  //     return model;

  //   } else {
  //     this.authenticationService.logout();

  //   }
  // }
}
