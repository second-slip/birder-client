import { Component, OnInit } from '@angular/core';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { LifeListService } from './life-list.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe, SlicePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-life-list',
  templateUrl: './life-list.component.html',
  styleUrls: ['./life-list.component.scss'],
  providers: [LifeListService],
  standalone: true,
  imports: [RouterLink, NgFor, LoadingComponent, AsyncPipe, SlicePipe, MatPaginatorModule]
})
export class LifeListComponent implements OnInit {
  public page = 0;
  public pageSize = 5;

  constructor(readonly _service: LifeListService
    , readonly _analysisService: ObservationCountService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData(); // ToDo: implement username
  }

  public reload(): void {
    this._getData();
  }

  pageEvent: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.page = e.pageIndex;

    this._changePage();
  }

  private _changePage(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
