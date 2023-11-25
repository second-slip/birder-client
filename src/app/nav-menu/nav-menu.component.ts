import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../_auth/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, NgIf, MatIconModule, AsyncPipe]
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

