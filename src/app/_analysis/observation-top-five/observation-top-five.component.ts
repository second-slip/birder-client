import { Component, OnInit } from '@angular/core';
import { ObservationTopFiveService } from './observation-top-five.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { AsyncPipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TopTableComponent } from './top-table/top-table.component';

@Component({
  selector: 'app-observation-top-five',
  templateUrl: './observation-top-five.component.html',
  styleUrls: ['./observation-top-five.component.scss'],
  standalone: true,
  imports: [MatTabsModule, LoadingComponent, AsyncPipe, TopTableComponent]
})
export class ObservationTopFiveComponent implements OnInit {

  constructor(readonly _service: ObservationTopFiveService) { }

  ngOnInit(): void {
    this._getData();
  }

  public reload(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData();
  }
}