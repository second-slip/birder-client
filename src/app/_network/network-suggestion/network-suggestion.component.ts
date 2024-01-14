import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NetworkSuggestionService } from './network-suggestion.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';

import { NetworkUserComponent } from '../network-user/network-user.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-network-suggestion',
    templateUrl: './network-suggestion.component.html',
    styleUrls: ['./network-suggestion.component.scss'],
    providers: [NetworkSuggestionService],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, NgFor, NetworkUserComponent,  LoadingComponent, AsyncPipe]
})
export class NetworkSuggestionComponent implements OnInit {

  constructor(readonly _service: NetworkSuggestionService) { }

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