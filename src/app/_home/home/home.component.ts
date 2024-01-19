import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { FeaturesComponent } from '../../_about/features/features.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterLink, FeaturesComponent, MatButtonModule]
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router,
    private _service: AuthenticationService) { }

  ngOnInit(): void {
    if (this._service.isLoggedIn())
      this._router.navigate(['/feed-p/public']);
  }
}