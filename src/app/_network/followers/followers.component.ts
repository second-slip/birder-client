import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { FollowersService } from './followers.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FollowersComponent implements OnInit {

  constructor(readonly _service: FollowersService
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData();
  }

  public reload(): void {
    this._getData();
  }
}
