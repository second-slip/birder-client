import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NetworkSuggestionService } from './network-suggestion.service';

@Component({
  selector: 'app-network-suggestion',
  templateUrl: './network-suggestion.component.html',
  styleUrls: ['./network-suggestion.component.scss'],
  encapsulation: ViewEncapsulation.None
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
