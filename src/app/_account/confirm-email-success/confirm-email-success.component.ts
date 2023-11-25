import { Component, ViewEncapsulation } from '@angular/core';
import { LoginComponent } from '../../_auth/login/login.component';

@Component({
    selector: 'app-confirm-email-success',
    templateUrl: './confirm-email-success.component.html',
    styleUrls: ['./confirm-email-success.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [LoginComponent]
})
export class ConfirmEmailSuccessComponent  { }