import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';

@Component({
  selector: 'app-filter-control',
  templateUrl: './filter-control.component.html',
  styleUrls: ['./filter-control.component.scss']
})
export class FilterControlComponent {
  @Input() currentFilter: string;

  constructor(readonly _authService: AuthenticationService) { }
}