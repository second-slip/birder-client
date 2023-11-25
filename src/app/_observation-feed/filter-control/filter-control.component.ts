import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { RouterLink } from '@angular/router';
import { NgbDropdown, NgbDropdownAnchor, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-filter-control',
    templateUrl: './filter-control.component.html',
    styleUrls: ['./filter-control.component.scss'],
    standalone: true,
    imports: [NgIf, NgbDropdown, NgbDropdownAnchor, NgbDropdownMenu, NgbDropdownItem, RouterLink, AsyncPipe]
})
export class FilterControlComponent {
  @Input() currentFilter: string;

  constructor(readonly _authService: AuthenticationService) { }
}