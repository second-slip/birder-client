import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationCrudService } from '../observation-crud.service';
import { ObservationReadService } from '../observation-read.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-observation-delete',
    templateUrl: './observation-delete.component.html',
    styleUrls: ['./observation-delete.component.scss'],
    providers: [ObservationReadService],
    imports: [RouterLink, NavigationMenuComponent, LoadingComponent, AsyncPipe, DatePipe]
})
export class ObservationDeleteComponent implements OnInit, OnDestroy {
  private _observationId: string;
  private _subscription = new Subject();
  public requesting: boolean;

  constructor(readonly _service: ObservationReadService
    , readonly _authService: AuthenticationService
    , private readonly _router: Router
    , private readonly _route: ActivatedRoute
    , private readonly _navigation: NavigationService
    , private readonly _announcement: AnnounceChangesService
    , private readonly _observationCrudService: ObservationCrudService) { }

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

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }

  public deleteObservation(id: number): void {
    this._observationCrudService.deleteObservation(id)
      .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this._announcement.announceObservationsChanged();
          this._router.navigate(['/feed-p/public']);
        },
        error: (e) => {
          console.log('error');
          // this.errorObject = e; this._handleError(e); 
        }//,
        //complete: () => { }
      });
  }

  public redirect(): void {
    this._redirect();
  }

  private _redirect(): void {
    this._navigation.back();
  }
}