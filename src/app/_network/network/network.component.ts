import { Component } from '@angular/core';
import { NetworkFindComponent } from '../network-find/network-find.component';
import { NetworkSuggestionComponent } from '../network-suggestion/network-suggestion.component';
import { NetworkSummaryComponent } from '../network-summary/network-summary.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-network',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss'],
    standalone: true,
    imports: [MatTabsModule, NetworkSummaryComponent, NetworkSuggestionComponent, NetworkFindComponent]
})
export class NetworkComponent { }