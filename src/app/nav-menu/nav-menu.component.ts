import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReadTokenService } from '../_auth/read-token.service';
import { AuthenticationService } from '../_services/authentication.service';

// import { UserViewModel } from '@app/_models/UserViewModel';
// import { AuthenticationService } from '@app/_services/authentication.service';
// import { TokenService } from '@app/_services/token.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavMenuComponent implements OnInit {
  isNavbarCollapsed = true;

  authenticatedUser: any; // UserViewModel;

  constructor(readonly _service: AuthenticationService) {}

  ngOnInit(): void {
    this._getAuthStatus();
  }

  private _getAuthStatus(): void {
    this._service.TEMPORARY();
  }

  // private _getAuthenticatedUser(): void {
  //   if (this.isLoggedIn) {
  //     this.authenticatedUser = this._service.GetAuthenticatedUserDetails();
  //   } else {
  //     this.authenticatedUser = null;
  //   }
  // }
}

