import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { INetworkUser } from 'src/app/_network/i-network-user.dto';
import { NetworkUserService } from 'src/app/_network/network-user/network-user.service';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [UserProfileService],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private _username: string | null;
  private _subscription = new Subject();

  constructor(readonly _service: UserProfileService
    , readonly _analysisService: ObservationCountService
    , private readonly _networkService: NetworkUserService
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

  public followOrUnfollow(element: any, user: INetworkUser): void {

    const action = element.innerText;

    if (action === 'Follow') {
      this._networkService.postFollowUser(user)
        .pipe(first(), takeUntil(this._subscription))
        .subscribe({
          next: _ => { element.innerText = 'Unfollow'; },
          // this.toast.info('You have followed ' + data.userName, 'Success');
          error: ((error: any) => {
            // ToDo: write proper error actions
          })
        });
      return;
    } else {
      this._networkService.postUnfollowUser(user)
        .pipe(first(), takeUntil(this._subscription))
        .subscribe({
          next: _ => { element.innerText = 'Follow'; }, // this.user = data;
          error: ((error: any) => {
            // ToDo: write proper error actions
          })
        });
      return;
    }
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
