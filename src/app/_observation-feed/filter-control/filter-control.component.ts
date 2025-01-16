import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-filter-control',
    templateUrl: './filter-control.component.html',
    styleUrls: ['./filter-control.component.scss'],
    imports: [MatButtonModule, MatMenuModule, RouterLink, AsyncPipe],
     // temporarily restore to enable MockComponent (ng-mocks) in tests
})
export class FilterControlComponent {
  @Input() currentFilter: string;

  constructor(readonly _authService: AuthenticationService) { }
}