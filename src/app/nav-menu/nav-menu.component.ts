import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReadTokenService } from '../_auth/read-token.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavMenuComponent implements OnInit {
  isNavbarCollapsed = true;
  // need to read this from token service...
  authenticatedUser: any; // UserViewModel;

  constructor(readonly _service: AuthenticationService) { }

  ngOnInit(): void {
    this._getAuthStatus();
    // this._serv.GetAuthenticatedUserDetails();
  }

  private _getAuthStatus(): void {
    this._service.checkAuthStatus();
  }

  private _getAuthenticatedUser(): void {
  //   if (this.isLoggedIn) {
  //     this.authenticatedUser = this._service.GetAuthenticatedUserDetails();
  //   } else {
  //     this.authenticatedUser = null;
  //   }
  }
}

