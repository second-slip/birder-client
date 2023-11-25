import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { ObservationTopFiveService } from './observation-top-five.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbAlert, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-observation-top-five',
    templateUrl: './observation-top-five.component.html',
    styleUrls: ['./observation-top-five.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgFor, RouterLink, NgbAlert, NgbNavOutlet, LoadingComponent, AsyncPipe, DecimalPipe]
})
export class ObservationTopFiveComponent implements OnInit {
  active: number = 1;

  constructor(readonly _service: ObservationTopFiveService, readonly _authService: AuthenticationService) { }

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
  // private _setActiveTab(qtyThisMonth: number): void {
  //   if (qtyThisMonth) {
  //     this.active = 1;
  //   } else {
  //     this.active = 2;
  //   }
  // }
}
