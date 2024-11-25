import {
  Component,
  EventEmitter,
  input,
  OnInit,
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
  templateUrl: './observation-feed-item.component.html',
  styleUrls: ['./observation-feed-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, MatIconModule, AsyncPipe, DatePipe],
})
export class ObservationFeedItemComponent implements OnInit {
  // @Input({required: true}) observation: IObservationFeed;
  observation = input.required<IObservationFeed>();

  @Output() loaded = new EventEmitter<number>();

  ngOnInit() {
    this.loaded.emit(this.observation().observationId);
  }

  constructor(readonly _authService: AuthenticationService) {}
}
