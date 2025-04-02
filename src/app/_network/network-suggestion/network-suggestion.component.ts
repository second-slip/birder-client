import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NetworkSuggestionService } from './network-suggestion.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { AsyncPipe } from '@angular/common';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-network-suggestion',
  templateUrl: './network-suggestion.component.html',
  styleUrls: ['./network-suggestion.component.scss'],
  providers: [NetworkSuggestionService],
  encapsulation: ViewEncapsulation.None,
  imports: [NetworkUserComponent, LoadingComponent, AsyncPipe],
})
export class NetworkSuggestionComponent implements OnInit {
  constructor(
    protected readonly _service: NetworkSuggestionService,
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
