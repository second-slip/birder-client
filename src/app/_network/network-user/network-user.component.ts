import { Component, Input, ViewEncapsulation } from '@angular/core';
import { INetworkUser } from '../i-network-user.dto';
import { NetworkUserService } from './network-user.service';

@Component({
  selector: 'app-network-user',
  templateUrl: './network-user.component.html',
  styleUrls: ['./network-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkUserComponent {
  @Input() user: INetworkUser

  constructor(private readonly _service: NetworkUserService) { }

  public followOrUnfollow(): void {

    if (this.user.isFollowing === false) {
      this._service.postFollowUser(this.user)
        .subscribe({
          next: (data: INetworkUser) => {
            this.user = data;
            // this.toast.info('You have followed ' + data.userName, 'Success');
          },
          error: ((error: any) => {
            // ToDo: write proper error actions
            // this.toast.error(error.friendlyMessage, 'An error occurred');
          })
        });
      return;
    } else {
      this._service.postUnfollowUser(this.user)
        .subscribe({
          next: (data: INetworkUser) => {
            // this.toast.info('You have unfollowed ' + data.userName, 'Success');
            this.user = data;
          },
          error: ((error: any) => {
            // ToDo: write proper error actions
            // this.toast.error(error.friendlyMessage, 'An error occurred');
          })
        });
      return;
    }
  }
}
