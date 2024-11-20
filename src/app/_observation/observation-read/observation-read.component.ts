import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationReadService } from '../observation-read.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';
import { ViewOnlyNotesComponent } from '../../_observation-note/view-notes/view-only-notes.component';
import { MatIconModule } from '@angular/material/icon';
import { ReadOnlyMapComponent } from '../../_map/read-only-map/read-only-map.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { LoremIpsumComponent } from 'src/app/lorem-ipsum/lorem-ipsum.component';

@Component({
    selector: 'app-observation-read',
    templateUrl: './observation-read.component.html',
    styleUrls: ['./observation-read.component.scss'],
    providers: [ObservationReadService],
    imports: [RouterLink, MatTabsModule, LoremIpsumComponent, ReadOnlyMapComponent, MatIconModule, ViewOnlyNotesComponent, NavigationMenuComponent, LoadingComponent, AsyncPipe, DatePipe]
})
export class ObservationReadComponent implements OnInit {
  private _observationId: string;

  constructor(readonly _service: ObservationReadService
    , readonly _authService: AuthenticationService
    , private readonly _navigation: NavigationService
    , private readonly _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this._getData(pmap.get('id'));
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

  private _redirect(): void {
    this._navigation.back();
  }
}