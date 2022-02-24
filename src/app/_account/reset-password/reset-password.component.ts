import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ValidatePassword } from 'src/app/_validators';
import { AccountService } from '../account.service';
import { IResetPassword } from './i-reset-password.dto';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  //
  private _code: string;
  //
  public requesting: boolean;
  public submitted: boolean = false;
  public resetPasswordForm: FormGroup;
  public errorObject: any = null;

  constructor(readonly _service: AccountService
    , private _formBuilder: FormBuilder
    , private readonly _navigation: NavigationService
    , private readonly _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.params.subscribe(_ => {
      this._route.paramMap.subscribe(pmap => {
        this._getCode(pmap.get('code'));
      })
    });
  }

  private _getCode(code: string | null): void {
    this._code = code ?? '';
    this._createForms();
    // if (code) {
    //   this._code = code; // ?? '';
    //   this._createForms();
    // }
    // else {
    //   //this._redirect();
    // }
  }

  // public reload(): void {
  //   if (this._observationId) {
  //     this._getData(this._observationId);
  //   } else {
  //     this._redirect();
  //   }
  // }

  public onSubmit(value: any): void {
    this.requesting = true;

    try {
      const model = <IResetPassword>{
        email: value.email,
        password: value.passwordGroup.password,
        confirmPassword: value.passwordGroup.confirmPassword,
        code: this._code
      };

      this._service.resetPassword(model)
        .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
        .subscribe({
          next: (r) => { this.submitted = true; },
          error: (e) => { this.errorObject = e; }
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }

  private _createForms() {
    this.resetPasswordForm = this._formBuilder.group({
      email: ['',
        {
          validators: [Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]
        }
      ],
      passwordGroup: this._formBuilder.group({
        password: ['', {
          validators: [
            Validators.minLength(8),
            Validators.required, // regex: accept letters, numbers and !@#$%.  Must have at least one letter and number
            Validators.pattern('^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%]+$')] // ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        }],
        confirmPassword: ['', {
          validators: [
            Validators.required]
        }],
      }, { validator: ValidatePassword.passwordMatcher })
    })
  }

  reset_password_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'Your new password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one number and one letter' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'You must confirm your new password' },
      { type: 'match', message: 'Passwords do not match' }
    ]
  };
}
