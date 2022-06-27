import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IBirdDetail } from '../bird-detail/i-bird-detail.dto';

@Component({
  selector: 'app-bird-info',
  templateUrl: './bird-info.component.html',
  styleUrls: ['./bird-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BirdInfoComponent {
  @Input() bird: IBirdDetail;
}