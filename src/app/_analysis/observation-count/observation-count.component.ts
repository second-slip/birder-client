import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ObservationCountService } from './observation-count.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, AsyncPipe } from '@angular/common';


@Component({
    selector: 'app-observation-count',
    templateUrl: './observation-count.component.html',
    styleUrls: ['./observation-count.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, NgbAlert, RouterLink, LoadingComponent, AsyncPipe]
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
