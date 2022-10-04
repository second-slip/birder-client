import { Injectable } from '@angular/core';
import { ObservationCountService } from '../_analysis/observation-count/observation-count.service';
import { ObservationTopFiveService } from '../_analysis/observation-top-five/observation-top-five.service';

@Injectable({
  providedIn: 'root'
})
export class AnnounceChangesService {

  constructor(private readonly _obsCountService: ObservationCountService
    , private readonly _obsTopFiveService: ObservationTopFiveService) { }

  public announceObservationsChanged(): void {
    this._obsCountService.getData();
    this._obsTopFiveService.getData();
  }
}
