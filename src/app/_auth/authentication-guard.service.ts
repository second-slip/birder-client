import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate, CanActivateChild {

  constructor(private readonly _router: Router, private readonly _authenticationService: AuthenticationService) { }

  // *****
  // not sure if this initialisation line is required
  ngOnInit(): void {
    this._getAuthStatus();
  }

  private _getAuthStatus(): void {
    this._authenticationService.checkAuthStatus();
  }
  // *****

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._authenticationService.isAuthorised) {
      return true;
    } else {
      this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this._authenticationService.isAuthorised) {
      return true;
    } else {
      this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}