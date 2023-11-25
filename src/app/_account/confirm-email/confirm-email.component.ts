import { Component, ViewEncapsulation } from '@angular/core';
import { ConfirmEmailResendComponent } from '../confirm-email-resend/confirm-email-resend.component';

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['./confirm-email.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [ConfirmEmailResendComponent]
})
export class ConfirmEmailComponent {

  constructor() { }
}
