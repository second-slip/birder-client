import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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

  constructor(private _service: NetworkUserService) { }

  public followOrUnfollow(element: any, user: INetworkUser): void {
    const action = element.innerText;

    if (action === 'Follow') {
      this._service.postFollowUser(user)
        .subscribe({
          next: (data: INetworkUser) => {
            element.innerText = 'Unfollow';
            // this.toast.info('You have followed ' + data.userName, 'Success');
          },
          error: ((error: any) => {
            // this.toast.error(error.friendlyMessage, 'An error occurred');
          })
        });
      return;
    } else {
      this._service.postUnfollowUser(user)
        .subscribe({
          next: (data: INetworkUser) => {
            element.innerText = 'Follow';
            // this.toast.info('You have unfollowed ' + data.userName, 'Success');
          },
          error: ((error: any) => {
            // this.toast.error(error.friendlyMessage, 'An error occurred');
          })
        });
      return;
    }
  }
}
