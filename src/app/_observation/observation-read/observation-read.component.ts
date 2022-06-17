import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationReadService } from './observation-read.service';

@Component({
  selector: 'app-observation-read',
  templateUrl: './observation-read.component.html',
  styleUrls: ['./observation-read.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationReadComponent implements OnInit, OnDestroy {
  private _observationId: string;

  constructor(readonly _service: ObservationReadService
    , readonly _authService: AuthenticationService
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
      this._observationId = id;
      this._service.getData(id);
    }
    else {
      this._redirect();
    }
  }

  public reload(): void {
    if (this._observationId) {
      this._getData(this._observationId);
    } else {
      this._redirect();
    }
  }

  ngOnDestroy(): void {
    this._service.reset();
  }

  private _redirect(): void {
    this._navigation.back();
  }
}