import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-about-general',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './about-general.component.html',
  styleUrl: './about-general.component.scss'
})
export class AboutGeneralComponent { }