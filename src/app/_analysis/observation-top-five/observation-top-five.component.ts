import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ObservationTopFiveService } from './observation-top-five.service';

@Component({
  selector: 'app-observation-top-five',
  templateUrl: './observation-top-five.component.html',
  styleUrls: ['./observation-top-five.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationTopFiveComponent implements OnInit {
  active: number = 1;

  constructor(readonly _service: ObservationTopFiveService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData();
    //this._setActiveTab();    -----> how to do this?
  }

  public reload(): void {
    this._getData();
  }

  // ??????????
  private _setActiveTab(qtyThisMonth: number): void {
    if (qtyThisMonth) {
      this.active = 1;
    } else {
      this.active = 2;
    }
  }
}
