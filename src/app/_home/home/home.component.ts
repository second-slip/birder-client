import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { FeaturesComponent } from '../../_about/features/features.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, FeaturesComponent]
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router,
    private _service: AuthenticationService) { }

  ngOnInit(): void {
    if (this._service.isLoggedIn())
      this._router.navigate(['/feed-p/public']);
  }
}