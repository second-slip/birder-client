import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnounceChangesService {
  private _networkChanged = new Subject();
  private _observationsChanged = new Subject();

  public observationsChanged$ = this._observationsChanged.asObservable();
  public networkChanged$ = this._networkChanged.asObservable();

  constructor() {}

  public announceObservationsChanged(message: string): void {
    this._observationsChanged.next(true);
  }

  public announceNetworkChanged(message: string): void {
    this._networkChanged.next(true);
  }
}
