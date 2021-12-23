import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private _authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this._getAuthStatus();
  }

  private _getAuthStatus(): void {
    this._authenticationService.checkAuthStatus();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._authenticationService.isAuthorised) {
      return true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //   const token = localStorage.getItem('jwt');

    //   if (token && !this.jwtHelper.isTokenExpired(token)) {
    //     // console.log(this.jwtHelper.decodeToken(token));
    //     return true;
    //   }
    //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //   return false;
    // }
    if (this._authenticationService.isAuthorised) {
      return true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
