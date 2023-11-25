import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { FollowersService } from './followers.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-followers',
    templateUrl: './followers.component.html',
    styleUrls: ['./followers.component.scss'],
    providers: [FollowersService],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, RouterLink, NgFor, NetworkUserComponent, NgbAlert, LoadingComponent, AsyncPipe]
})
export class FollowersComponent implements OnInit {
  public username: string | null = '';

  constructor(readonly _service: FollowersService
    , private _route: ActivatedRoute
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this.username = pmap.get('username');
      this._getData();
    });
  }

  private _getData(): void {
    this._service.getData(this.username);
  }

  public reload(): void {
    this._getData();
  }
}