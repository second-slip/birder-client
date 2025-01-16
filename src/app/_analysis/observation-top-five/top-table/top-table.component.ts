import { Component, Input } from '@angular/core';
import { IObservationTopFiveRecord } from '../i-observation-top-five-record.dto';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { AuthenticationService } from 'src/app/_auth/authentication.service';

@Component({
  selector: 'app-top-table',
  imports: [AsyncPipe, MatTableModule, RouterLink],
  templateUrl: './top-table.component.html',
  styleUrl: './top-table.component.scss',
  
})
export class TopTableComponent {
  @Input() topObservations: IObservationTopFiveRecord[] = [];
  displayedColumns: string[] = ['index', 'name', 'count'];

  constructor(readonly _authService: AuthenticationService) {}
}
