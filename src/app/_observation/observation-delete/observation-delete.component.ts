import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { TokenService } from 'src/app/_auth/token.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationCrudService } from '../observation-crud.service';
import { ObservationReadService } from '../observation-read/observation-read.service';

@Component({
  selector: 'app-observation-delete',
  templateUrl: './observation-delete.component.html',
  styleUrls: ['./observation-delete.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationDeleteComponent implements OnInit, OnDestroy {
  private _observationId: string;
  private _subscription = new Subject();
  public requesting: boolean;

  constructor(readonly _service: ObservationReadService
    , private readonly _router: Router
    , readonly _authService: AuthenticationService
    , private readonly _navigation: NavigationService
    , private readonly _observationCrudService: ObservationCrudService
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

  public deleteObservation(id: number): void {
    this._observationCrudService.deleteObservation(id)
      .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => { this._router.navigate(['/observation-feed']); },
        error: (e) => {
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