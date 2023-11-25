import { Component, Input, ViewEncapsulation } from '@angular/core';
import { INetworkUser } from '../i-network-user.dto';
import { FollowCommandComponent } from '../follow-command/follow-command.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-network-user',
    templateUrl: './network-user.component.html',
    styleUrls: ['./network-user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, FollowCommandComponent]
})
export class NetworkUserComponent {
  @Input() user: INetworkUser

  constructor() { }
}