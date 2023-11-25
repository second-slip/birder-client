import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BirdIndexService } from './bird-index.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-bird-index',
    templateUrl: './bird-index.component.html',
    styleUrls: ['./bird-index.component.scss'],
    providers: [BirdIndexService],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FormsModule, NgIf, NgFor, RouterLink, NgbPagination, LoadingComponent, AsyncPipe]
})
export class BirdIndexComponent implements OnInit {
  public page = 1;
  public pageSize = 30;
  public speciesFilter: string = '0';

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

  public changePage(): void {
    this._getData();
  }

  public onChangeFilter(): void {
    this.page = 1;
    this._getData();
  }
}