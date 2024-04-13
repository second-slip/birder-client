import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { IObservationFeed } from '../i-observation-feed.dto';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-observation-feed-item',
  templateUrl: './observation-feed-item.component.html',
  styleUrls: ['./observation-feed-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterLink, MatIconModule, AsyncPipe, DatePipe]
})
export class ObservationFeedItemComponent {
  @Input() observation: IObservationFeed;

  constructor(readonly _authService: AuthenticationService) { }
}