import { Component, Input, OnInit } from '@angular/core';
import { RecordingsService } from './recordings.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NgFor, AsyncPipe, SlicePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.scss'],
  providers: [RecordingsService],
  standalone: true,
  imports: [NgFor, LoadingComponent, AsyncPipe, SlicePipe, MatPaginatorModule]
})
export class RecordingsComponent implements OnInit {
  @Input() species: string;

  public page = 0;
  public pageSize = 10;
  public pageEvent: PageEvent;

  constructor(readonly _service: RecordingsService) { }

  // todo: refresh button in case of fetch error

  ngOnInit(): void {
    this._getRecordings();
  }

  private _getRecordings(): void {
    this._service.getData(this.species);
  }

  public handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.page = e.pageIndex;

    this._changePage();
  }

  private _changePage(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}