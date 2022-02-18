import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { AccountService } from '../account.service';
import { IEmailResend } from '../confirm-email/i-email-resend.dto';

@Component({
  selector: 'app-confirm-email-resend',
  templateUrl: './confirm-email-resend.component.html',
  styleUrls: ['./confirm-email-resend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmEmailResendComponent implements OnInit {
  private _subscription = new Subject();
  public requesting: boolean;
  public submitted: boolean = false;
  public resendConfirmEmailForm: FormGroup;
  public errorObject: any = null;

  resend_confirm_email_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
  };

  constructor(private _formBuilder: FormBuilder
    , private _service: AccountService) {}

  ngOnInit(): void {
    this._createForms();
  }

  onSubmit(formData: IEmailResend): void {
    this.requesting = true;

    this._service.resendEmailConfirmation(formData)
    .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
    .subscribe({
      next: (r) => { this.submitted = true; },
      error: (e) => {
        this.errorObject = e;
      }
    });
  }

  private _createForms(): void {
    this.resendConfirmEmailForm = this._formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }
}
