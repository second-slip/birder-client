import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { AccountService } from '../account.service';
import { IUserEmail } from '../i-user-email.dto';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public requesting: boolean;
  public requestPasswordResetForm: UntypedFormGroup;
  public submitProgress: 'idle' | 'success' | 'error' = 'idle';

  constructor(private _formBuilder: UntypedFormBuilder, private _service: AccountService) { }

  ngOnInit(): void {
    this._createForms();
  }

  public onSubmit(model: IUserEmail): void {
    if (!this.requestPasswordResetForm.valid) return;

    this.requesting = true;

    this._service.requestPasswordReset(model)
      .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: () => { this.submitProgress = 'success'; },
        error: () => { this.submitProgress = 'error'; }
      });
  }

  private _createForms(): void {
    this.requestPasswordResetForm = this._formBuilder.group({
      email: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }

  request_password_reset_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
  };
}