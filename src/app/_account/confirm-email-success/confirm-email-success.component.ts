import { Component, ViewEncapsulation } from '@angular/core';
import { LoginComponent } from '../../_auth/login/login.component';

@Component({
    selector: 'app-confirm-email-success',
    templateUrl: './confirm-email-success.component.html',
    styleUrls: ['./confirm-email-success.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [LoginComponent]
})
export class ConfirmEmailSuccessComponent  { }