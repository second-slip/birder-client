import { Component, ViewEncapsulation } from '@angular/core';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-technology',
    templateUrl: './technology.component.html',
    styleUrls: ['./technology.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase]
})
export class TechnologyComponent {

  constructor() { }

}
