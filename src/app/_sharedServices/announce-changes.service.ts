import { Injectable } from '@angular/core';
import { ObservationCountService } from '../_analysis/observation-count/observation-count.service';
import { ObservationTopFiveService } from '../_analysis/observation-top-five/observation-top-five.service';
import { NetworkSummaryService } from '../_network/network-summary/network-summary.service';

@Injectable({
  providedIn: 'root'
})
export class AnnounceChangesService {

  constructor(private readonly _obsCountService: ObservationCountService
    , private readonly _obsTopFiveService: ObservationTopFiveService
    , private readonly _networkSummaryService: NetworkSummaryService) { }

  public announceObservationsChanged(): void {
    this._obsCountService.getData();
    this._obsTopFiveService.getData();
  }

  public announceNetworkChanged(): void {
    this._networkSummaryService.getData();
  }
}
