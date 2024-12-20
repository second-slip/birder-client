import {
  Component,
  EventEmitter,
  input,
  OnInit,
  output,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { IObservationFeed } from '../i-observation-feed.dto';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-observation-feed-item',
  host: { class: 'wrapper' },
  templateUrl: './observation-feed-item.component.html',
  styleUrls: ['./observation-feed-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, MatIconModule, AsyncPipe, DatePipe],
  standalone: true, // temporarily restore to enable MockComponent (ng-mocks) in tests
})
export class ObservationFeedItemComponent implements OnInit {
  observation = input.required<IObservationFeed>();

  // @Output()
  // public loaded =  new EventEmitter<number>();
  whenLoaded = output<number>();

  constructor(readonly _authService: AuthenticationService) {}

  ngOnInit() {
    this.whenLoaded.emit(this.observation().observationId);
  }
}
