import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../_auth/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavMenuComponent implements OnInit {
  isNavbarCollapsed = true;

  constructor(readonly _service: AuthenticationService) { }

  ngOnInit(): void {
    this._getAuthStatus();
  }

  private _getAuthStatus(): void {
    this._service.checkAuthStatus();
  }
}

