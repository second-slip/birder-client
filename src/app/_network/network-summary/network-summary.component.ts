import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NetworkSummaryService } from './network-summary.service';

@Component({
  selector: 'app-network-summary',
  templateUrl: './network-summary.component.html',
  styleUrls: ['./network-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkSummaryComponent implements OnInit {

  constructor(readonly _service: NetworkSummaryService
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData();
  }

  public reload(): void {
    this._getData();
  }
}
