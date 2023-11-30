import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { UserProfileService } from './user-profile.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { FollowCommandComponent } from '../../_network/follow-command/follow-command.component';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { FollowersPluralPipe } from 'src/app/pipes/followers-plural.pipe';
import { ObservationSummaryPipe } from 'src/app/pipes/observation-summary.pipe';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    providers: [UserProfileService],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FollowersPluralPipe, ObservationSummaryPipe, NgIf, FollowCommandComponent, RouterLink, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet, LoadingComponent, AsyncPipe, DatePipe]
})
export class UserProfileComponent implements OnInit {
  private _username: string | null;

  constructor(readonly _service: UserProfileService
    , readonly _analysisService: ObservationCountService
    , private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this._username = pmap.get('username');
      this._getData();
    });
  }

  private _getData(): void {
    this._service.getData(this._username);
  }

  public reload(): void {
    this._getData();
  }
}