import { Component, ViewEncapsulation } from '@angular/core';
import { NetworkFindComponent } from '../network-find/network-find.component';
import { NetworkSuggestionComponent } from '../network-suggestion/network-suggestion.component';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { NetworkSummaryComponent } from '../network-summary/network-summary.component';

@Component({
    selector: 'app-network',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NetworkSummaryComponent, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NetworkSuggestionComponent, NetworkFindComponent, NgbNavOutlet]
})
export class NetworkComponent { }
