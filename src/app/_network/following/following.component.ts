import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { FollowingService } from './following.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
  providers: [FollowingService],
  encapsulation: ViewEncapsulation.None
})
export class FollowingComponent implements OnInit {

  public username: string | null;

  constructor(readonly _service: FollowingService
    , private _route: ActivatedRoute
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._route.params.subscribe(_ => {
      this._route.paramMap.subscribe(pmap => {
        this.username = pmap.get('username');
        this._getData();
      })
    });
  }

  private _getData(): void {
    this._service.getData(this.username);
  }

  public reload(): void {
    this._getData();
  }
}