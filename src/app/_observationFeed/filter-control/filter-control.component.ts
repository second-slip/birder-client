import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-control',
  templateUrl: './filter-control.component.html',
  styleUrls: ['./filter-control.component.scss']
})
export class FilterControlComponent {
  @Input() component: string;

  constructor() { }
}
