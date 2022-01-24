import { Component, OnInit } from '@angular/core';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { LifeListService } from './life-list.service';

@Component({
  selector: 'app-life-list',
  templateUrl: './life-list.component.html',
  styleUrls: ['./life-list.component.scss']
})
export class LifeListComponent implements OnInit {
  public page: number = 1;
  public pageSize = 10;

  constructor(readonly _service: LifeListService, readonly _analysisService: ObservationCountService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData(); // ToDo implement username
  }

  public reload(): void {
    this._getData();
  }

  public changePage(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
