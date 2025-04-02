import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from 'src/app/_loading/loading/loading.component';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { TopFiveService } from './top-five.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-top-five',
  imports: [MatTableModule, RouterLink, LoadingComponent],
  templateUrl: './top-five.component.html',
  styleUrl: './top-five.component.scss',
})
export class TopFiveComponent {
  protected displayedColumns: string[] = ['index', 'name', 'count'];

  constructor(
    private readonly _announcement: AnnounceChangesService,
    protected readonly _service: TopFiveService
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
