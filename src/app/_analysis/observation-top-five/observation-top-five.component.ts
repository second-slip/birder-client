import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TopFiveFilteredComponent } from './top-five-filtered/top-five-filtered.component';
import { TopFiveComponent } from './top-five/top-five.component';

@Component({
  selector: 'app-observation-top-five',
  templateUrl: './observation-top-five.component.html',
  imports: [MatTabsModule, TopFiveFilteredComponent, TopFiveComponent],
})
export class ObservationTopFiveComponent {}
