import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { FeaturesComponent } from 'src/app/_about/features/features.component';
import { AboutGeneralComponent } from '../about-general/about-general.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, RouterLink, FeaturesComponent, AboutGeneralComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  public placeholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Accumsan tortor posuere ac ut consequat semper viverra. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Eget velit aliquet sagittis id consectetur purus. Nisi quis eleifend quam adipiscing vitae proin. Sed cras ornare arcu dui vivamus arcu felis. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Eros donec ac odio tempor. Aliquam purus sit amet luctus venenatis lectus. Ut etiam sit amet nisl purus. Nunc id cursus metus aliquam eleifend mi in. Nec nam aliquam sem et tortor consequat id porta. Donec massa sapien faucibus et molestie ac feugiat sed. Ullamcorper eget nulla facilisi etiam. Orci porta non pulvinar neque laoreet suspendisse. Quisque id diam vel quam elementum pulvinar etiam. Sapien faucibus et molestie ac feugiat sed. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque. Iaculis eu non diam phasellus. Eget nullam non nisi est sit amet facilisis magna etiam."
}
