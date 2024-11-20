import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { ReadWriteMapComponent } from 'src/app/_map/read-write-map/read-write-map.component';
import { AccountService } from '../account.service';
import { IManageLocation } from './i-manage-location.dto';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-account-manage-location',
    templateUrl: './account-manage-location.component.html',
    styleUrls: ['./account-manage-location.component.scss'],
    imports: [ReadWriteMapComponent, RouterLink, AsyncPipe]
})
export class AccountManageLocationComponent implements OnInit, OnDestroy {
  @ViewChild(ReadWriteMapComponent)
  private _mapComponent: ReadWriteMapComponent;
  private _subscription = new Subject();
  public submitProgress: 'idle' | 'success' | 'error' = 'idle';
  public requesting: boolean;

  constructor(readonly _authService: AuthenticationService
    , private readonly _service: AccountService
    , private readonly _router: Router) { }

  ngOnInit(): void { }

  public updateLocation(): void {
    this.requesting = true;

    const model = <IManageLocation>{
      defaultLocationLatitude: this._mapComponent.locationMarker.position.lat,
      defaultLocationLongitude: this._mapComponent.locationMarker.position.lng,
    };

    this._service.postUpdateLocation(model)
      .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: () => {
          this.submitProgress = 'success';
          this._redirect();
        },
        error: () => { this.submitProgress = 'error'; }
      });
  }

  private _redirect(): void {
    this._router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}