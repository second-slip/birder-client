import { Component, ViewEncapsulation } from '@angular/core';
import { NetworkSuggestionComponent } from '../network-suggestion/network-suggestion.component';
import { NetworkSummaryComponent } from '../network-summary/network-summary.component';

@Component({
    selector: 'app-network-sidebar',
    templateUrl: './network-sidebar.component.html',
    styleUrls: ['./network-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NetworkSummaryComponent, NetworkSuggestionComponent]
})
export class NetworkSidebarComponent { }
