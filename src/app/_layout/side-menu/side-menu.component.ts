import { Component, ViewEncapsulation } from '@angular/core';
import { NetworkSidebarComponent } from '../../_network/network-sidebar/network-sidebar.component';
import { ObservationTopFiveComponent } from '../../_analysis/observation-top-five/observation-top-five.component';
import { TweetDayComponent } from '../../_tweet/tweet-day/tweet-day.component';
import { ObservationCountComponent } from '../../_analysis/observation-count/observation-count.component';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [ObservationCountComponent, TweetDayComponent, ObservationTopFiveComponent, NetworkSidebarComponent]
})
export class SideMenuComponent { }
