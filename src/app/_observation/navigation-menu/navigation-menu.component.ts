import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-navigation-menu',
    templateUrl: './navigation-menu.component.html',
    styleUrls: ['./navigation-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, NgIf]
})
export class NavigationMenuComponent {
  @Input() observationId: number;
  @Input() isRecordOwner: boolean;

  constructor() { }
}
