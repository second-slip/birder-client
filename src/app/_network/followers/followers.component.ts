import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { FollowersService } from './followers.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
  providers: [FollowersService],
  encapsulation: ViewEncapsulation.None
})
export class FollowersComponent implements OnInit {
  public username: string | null = '';

  constructor(readonly _service: FollowersService
    , private _route: ActivatedRoute
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this.username = pmap.get('username');
      this._getData();
    });
  }

  private _getData(): void {
    this._service.getData(this.username);
  }

  public reload(): void {
    this._getData();
  }
}