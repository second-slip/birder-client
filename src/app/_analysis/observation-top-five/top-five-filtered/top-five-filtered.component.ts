import { Component } from '@angular/core';
import { TopFiveFilterService } from './top-five-filter.service';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingComponent } from '../../../_loading/loading/loading.component';
import { AnnounceChangesService } from '../../../_sharedServices/announce-changes.service';

@Component({
  selector: 'app-top-five-filtered',
  imports: [MatTableModule, RouterLink, LoadingComponent],
  templateUrl: './top-five-filtered.component.html',
  styleUrl: './top-five-filtered.component.scss',
})
export class TopFiveFilteredComponent {
  displayedColumns: string[] = ['index', 'name', 'count'];

  constructor(
    private readonly _announcement: AnnounceChangesService,
    protected readonly _service: TopFiveFilterService
  ) {
    this._service.getData();
    this._announcement.observationsChanged$
      .pipe(takeUntilDestroyed())
      .subscribe((msg) => {
        this._service.getData();
      });
  }

  protected reload(): void {
    this._service.getData();
  }
}
