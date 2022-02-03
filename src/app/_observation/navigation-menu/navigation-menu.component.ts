import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationMenuComponent {
  @Input() observationId: number;
  @Input() isRecordOwner: boolean;

  constructor() { }
}
