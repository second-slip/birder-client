import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { FeaturesComponent } from 'src/app/_about/features/features.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, RouterLink, FeaturesComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent { }
