import { Component, Input, OnInit } from '@angular/core';
import { FollowingService } from './following.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-following',
    templateUrl: './following.component.html',
    styleUrls: ['./following.component.scss'],
    providers: [FollowingService],
    imports: [NetworkUserComponent, LoadingComponent, AsyncPipe]
})
export class FollowingComponent implements OnInit {
  @Input() username: string;

  constructor(readonly _service: FollowingService) { }

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