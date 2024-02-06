import { Component, OnInit } from '@angular/core';
import { BirdIndexService } from './bird-index.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-bird-index',
  templateUrl: './bird-index.component.html',
  styleUrls: ['./bird-index.component.scss'],
  providers: [BirdIndexService],
  standalone: true,
  imports: [FormsModule, NgFor, RouterLink, LoadingComponent, AsyncPipe, MatPaginatorModule]
})
export class BirdIndexComponent implements OnInit {
  public page = 0;
  public pageSize = 25;
  public speciesFilter: string = '0';
  public pageEvent: PageEvent;

  constructor(readonly _service: BirdIndexService) { }

  ngOnInit(): void {
    this._getData();
  }

  private _getData(): void {
    this._service.getData(this.page, this.pageSize, this.speciesFilter);
  }

  public reload(): void {
    this._getData();
  }

  public handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.page = e.pageIndex;

    this._getData();
    this._changePage();
  }

  private _changePage(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public onChangeFilter(): void {
    this.page = 1;
    this._getData();
  }
}