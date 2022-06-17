import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { ReadWriteMapComponent } from 'src/app/_map/read-write-map/read-write-map.component';
import { AccountManagerService } from '../account-manager.service';
import { IManageLocation } from './i-manage-location.dto';

@Component({
  selector: 'app-account-manage-location',
  templateUrl: './account-manage-location.component.html',
  styleUrls: ['./account-manage-location.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountManageLocationComponent implements OnInit, OnDestroy {
  @ViewChild(ReadWriteMapComponent)
  private _mapComponent: ReadWriteMapComponent;
  private _subscription = new Subject();

  public requesting: boolean;
  public errorObject: any = null;

  constructor(readonly _authService: AuthenticationService
    , private readonly _service: AccountManagerService
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
      next: (r) => { this._redirect(); },
      error: (e) => { this.errorObject = e; }
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
