import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { ObservationFeedService } from '../observation-feed.service';

@Component({
  selector: 'app-observation-feed',
  templateUrl: './observation-feed.component.html',
  styleUrls: ['./observation-feed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationFeedComponent implements OnInit, OnDestroy {

  private _page: number;

  constructor(readonly _service: ObservationFeedService, readonly _authService: AuthenticationService) { }
  
  
  ngOnDestroy(): void {
    
    // console.log('destroy');
    // this._service.resetFeed();
  }

  ngOnInit(): void {
    this._service.resetFeed();
    console.log('init ' + this._page);
    this._page = 1
    console.log(this._page);
    this._service.getData(this._page);
    // this.onScroll();
  }


  // first load of data means scroll is called twice?
  public onScroll(): void {
    console.log('onScroll()')
    this._page ++;
    this._service.getData(this._page);
  }

  public reload(): void {
    //this._getData();
  }
}
