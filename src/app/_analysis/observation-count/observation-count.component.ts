import { Component, OnInit } from '@angular/core';
import { ObservationCountService } from './observation-count.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ObservationPluralPipe } from 'src/app/pipes/observation-plural.pipe';

@Component({
  selector: 'app-observation-count',
  templateUrl: './observation-count.component.html',
  styleUrls: ['./observation-count.component.scss'],
  standalone: true,
  imports: [RouterLink, LoadingComponent, AsyncPipe, ObservationPluralPipe]
})
export class ObservationCountComponent implements OnInit {

  constructor(readonly _service: ObservationCountService) { }

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