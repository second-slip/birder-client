import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/_auth/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router,
    private _token: TokenService) { }

  ngOnInit(): void {
    if (this._token.isTokenValid())
      this._router.navigate(['/feed-p/public']);
  }
}