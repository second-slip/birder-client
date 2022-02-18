import { Component, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'src/app/_auth/authentication.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmEmailComponent {

  constructor(private readonly _authService: AuthenticationService) { 
    this._authService.logout(); // for users redirected from account manager
  }
}
