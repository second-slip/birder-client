import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgIf]
})
export class FeaturesComponent {
  @Input()
  public showBlurb: boolean;
}
