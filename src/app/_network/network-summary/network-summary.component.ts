import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NetworkSummaryService } from './network-summary.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-network-summary',
    templateUrl: './network-summary.component.html',
    styleUrls: ['./network-summary.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, RouterLink, LoadingComponent, AsyncPipe]
})
export class NetworkSummaryComponent implements OnInit {
  @Input()
  public showTitle: boolean;

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
