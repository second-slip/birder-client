import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { BirdDetailService } from './bird-detail.service';

@Component({
  selector: 'app-bird-detail',
  templateUrl: './bird-detail.component.html',
  styleUrls: ['./bird-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BirdDetailComponent implements OnInit {
  private _birdId: string;

  constructor(readonly _service: BirdDetailService
    , private readonly _navigation: NavigationService
    , private readonly _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.params.subscribe(_ => {
      this._route.paramMap.subscribe(pmap => {
        this._getData(pmap.get('id'));
      })
    });
  }

  private _getData(id: string | null): void {
    if (id) {
      this._birdId = id;
      this._service.getData(id);
    }
    else {
      this._redirect();
    }
  }

  public reload(): void {
    if (this._birdId) {
      this._getData(this._birdId);
    } else {
      this._redirect();
    }
  }

  private _redirect(): void {
    this._navigation.back();
  }

  ngOnDestroy(): void {
    this._service.reset();
  }
}