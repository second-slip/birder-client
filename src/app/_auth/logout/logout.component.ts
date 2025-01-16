import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    
})
export class LogoutComponent {

  constructor(private readonly _authService: AuthenticationService
    , private readonly _navigation: NavigationService
    , private readonly _router: Router) { }

  public confirmLogout(): void {
    this._authService.logout();
    this._router.navigate(['home']);
  }

  public cancelLogout(): void {
    this._navigation.back();
  }
}
