import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NetworkSummaryService } from './network-summary.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-network-summary',
  templateUrl: './network-summary.component.html',
  styleUrls: ['./network-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, LoadingComponent, AsyncPipe],
})
export class NetworkSummaryComponent implements OnInit {
  @Input()
  public showTitle: boolean;

  constructor(
    protected readonly _service: NetworkSummaryService,
    protected readonly _authService: AuthenticationService,
    private _announcement: AnnounceChangesService
  ) {
    this._announcement.networkChanged$
      .pipe(takeUntilDestroyed())
      .subscribe((msg) => {
        this._service.getData();
      });
  }

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
