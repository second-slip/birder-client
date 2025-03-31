import { Component } from '@angular/core';
import { ObservationCountService } from './observation-count.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ObservationPluralPipe } from 'src/app/pipes/observation-plural.pipe';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-observation-count',
  templateUrl: './observation-count.component.html',
  styleUrls: ['./observation-count.component.scss'],
  imports: [RouterLink, LoadingComponent, AsyncPipe, ObservationPluralPipe],
})
export class ObservationCountComponent {
  constructor(
    protected readonly _service: ObservationCountService,
    private readonly _announcement: AnnounceChangesService
  ) {
    this._service.getData();
    this._announcement.observationsChanged$
      .pipe(takeUntilDestroyed())
      .subscribe((msg) => {
        this._service.getData();
      });
  }

  public reload(): void {
    this._service.getData();
  }
}
