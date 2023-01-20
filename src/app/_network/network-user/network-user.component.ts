import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { first, Subject, takeUntil } from 'rxjs';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { INetworkUser } from '../i-network-user.dto';
import { NetworkUserService } from './network-user.service';

@Component({
  selector: 'app-network-user',
  templateUrl: './network-user.component.html',
  styleUrls: ['./network-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkUserComponent implements OnDestroy {
  @Input() user: INetworkUser

  private _subscription = new Subject();

  constructor(private readonly _service: NetworkUserService,
    private readonly _announce: AnnounceChangesService) { }

  public followOrUnfollow(): void {
    if (this.user.isFollowing === false) {
      this._service.postFollowUser(this.user)
        .pipe(first(), takeUntil(this._subscription))
        .subscribe({
          next: (data: INetworkUser) => {
            this.user = data;
            this._announce.announceNetworkChanged();
            // this.toast.info('You have followed ' + data.userName, 'Success');
          },
          error: ((error: any) => {
            // ToDo: write proper error actions
            // this.toast.error(error.friendlyMessage, 'An error occurred');
          })
        });
      // return;
    } else {
      this._service.postUnfollowUser(this.user)
        .pipe(first(), takeUntil(this._subscription))
        .subscribe({
          next: (data: INetworkUser) => {
            // this.toast.info('You have unfollowed ' + data.userName, 'Success');
            this.user = data;
            this._announce.announceNetworkChanged();
          },
          error: ((error: any) => {
            // ToDo: write proper error actions
            // this.toast.error(error.friendlyMessage, 'An error occurred');
          })
        });
      // return;
    }
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}