import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { FollowingService } from './following.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-following',
    templateUrl: './following.component.html',
    styleUrls: ['./following.component.scss'],
    providers: [FollowingService],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, RouterLink, NgFor, NetworkUserComponent,  LoadingComponent, AsyncPipe]
})
export class FollowingComponent implements OnInit {
  public username: string | null;

  constructor(readonly _service: FollowingService
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