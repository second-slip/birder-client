import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { FollowingComponent } from '../following/following.component';
import { FollowersComponent } from '../followers/followers.component';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [AsyncPipe, MatTabsModule, FollowingComponent, FollowersComponent],
  templateUrl: './network-list.component.html',
  styleUrl: './network-list.component.scss'
})
export class NetworkListComponent {
  @Input() username: string;
  @Input() tab: string;

  constructor(readonly _authService: AuthenticationService) { }
}