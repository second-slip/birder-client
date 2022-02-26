import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { ObservationFeedService } from '../observation-feed.service';

@Component({
  selector: 'app-observation-feed',
  templateUrl: './observation-feed.component.html',
  styleUrls: ['./observation-feed.component.scss'],
  providers: [ObservationFeedService],
  encapsulation: ViewEncapsulation.None
})
export class ObservationFeedComponent implements OnInit {
  private _page: number;

  constructor(readonly _service: ObservationFeedService
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    // console.log('init ' + this._page);
    this._page = 1
    // console.log(this._page);
    this._service.getData(this._page);

    // this.onScroll();
  }

  // first load of data means scroll is called twice?
  public onScroll(): void {
    // console.log('onScroll()')
    this._page++;
    this._service.getData(this._page);
  }

  public reload(): void {
    this._page = 1;
    this._service.getData(this._page);
  }

  // ngOnDestroy(): void {
  //   // console.log('destroy');
  // }
}
