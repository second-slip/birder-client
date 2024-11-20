import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FollowersService } from './followers.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-followers',
    templateUrl: './followers.component.html',
    styleUrls: ['./followers.component.scss'],
    providers: [FollowersService],
    imports: [RouterLink, NetworkUserComponent, LoadingComponent, AsyncPipe]
})
export class FollowersComponent implements OnInit {
  @Input() username: string;

  constructor(readonly _service: FollowersService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData(this.username);
  }

  public reload(): void {
    this._getData();
  }
}