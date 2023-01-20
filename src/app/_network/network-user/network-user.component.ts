import { Component, Input, ViewEncapsulation } from '@angular/core';
import { INetworkUser } from '../i-network-user.dto';

@Component({
  selector: 'app-network-user',
  templateUrl: './network-user.component.html',
  styleUrls: ['./network-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkUserComponent {
  @Input() user: INetworkUser

  constructor() { }
}