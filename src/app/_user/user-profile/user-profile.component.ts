import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { UserProfileService } from './user-profile.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { FollowCommandComponent } from '../../_network/follow-command/follow-command.component';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { FollowersPluralPipe } from 'src/app/pipes/followers-plural.pipe';
import { ObservationSummaryPipe } from 'src/app/pipes/observation-summary.pipe';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [UserProfileService],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [FollowersPluralPipe, ObservationSummaryPipe, NgIf, FollowCommandComponent, RouterLink, MatTabsModule, LoadingComponent, AsyncPipe, DatePipe]
})
export class UserProfileComponent implements OnInit {
  public placeholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Accumsan tortor posuere ac ut consequat semper viverra. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Eget velit aliquet sagittis id consectetur purus. Nisi quis eleifend quam adipiscing vitae proin. Sed cras ornare arcu dui vivamus arcu felis. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Eros donec ac odio tempor. Aliquam purus sit amet luctus venenatis lectus. Ut etiam sit amet nisl purus. Nunc id cursus metus aliquam eleifend mi in. Nec nam aliquam sem et tortor consequat id porta. Donec massa sapien faucibus et molestie ac feugiat sed. Ullamcorper eget nulla facilisi etiam. Orci porta non pulvinar neque laoreet suspendisse. Quisque id diam vel quam elementum pulvinar etiam. Sapien faucibus et molestie ac feugiat sed. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque. Iaculis eu non diam phasellus. Eget nullam non nisi est sit amet facilisis magna etiam."
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