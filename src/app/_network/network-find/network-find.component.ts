import { Component, ViewEncapsulation } from '@angular/core';
import { NetworkFindService } from './network-find.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NetworkUserComponent } from '../network-user/network-user.component';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-network-find',
    templateUrl: './network-find.component.html',
    styleUrls: ['./network-find.component.scss'],
    providers: [NetworkFindService],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FormsModule, NetworkUserComponent,  LoadingComponent, AsyncPipe]
})
export class NetworkFindComponent {
  public searchTerm = '';
  public searchRequested = false;

  constructor(public readonly _service: NetworkFindService) { }

  public searchNetwork(): void {
    this._getData();
    this.searchRequested = true;
  }

  private _getData(): void {
    if (!this.searchTerm) { return };
    this._service.getData(this.searchTerm);
    this._clearForm();
  }

  private _clearForm(): void {
    this.searchTerm = '';
  }

  public reload(): void {
    this._getData();
  }
}