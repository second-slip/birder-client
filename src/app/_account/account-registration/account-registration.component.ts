import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { MatchOtherValidator, RestrictedNameValidator, ValidatePassword } from 'src/app/_validators';
import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { IAccountRegistration } from './i-account-registration';

@Component({
  selector: 'app-account-registration',
  templateUrl: './account-registration.component.html',
  styleUrls: ['./account-registration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountRegistrationComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public requesting: boolean;
  public invalidRegistration: boolean;
  public errorObject: any = null;
  public userRegisterForm: UntypedFormGroup;

  constructor(private _formBuilder: UntypedFormBuilder
    , private _service: AccountService
    , private _validation: AccountValidationService
    , private _router: Router) { }

  ngOnInit() {
    this._createForms();
  }

  public onSubmit(value: any): void {
    this.requesting = true;

    try {
      const model = <IAccountRegistration>{
        userName: value.username,
        email: value.email,
        password: value.passwordGroup.password,
        confirmPassword: value.passwordGroup.confirmPassword
      };

      this._service.register(model)
        .pipe(first(), finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
        .subscribe({
          next: () => { this._router.navigate(['/confirm-email']); },
          error: (e) => {
            //todo: change implementation...
            this.errorObject = e;
            this.invalidRegistration = true;
          }
        });

    } catch (error) {
      console.log(error);
    }
  }

  private _createForms() {
    this.userRegisterForm = this._formBuilder.group({
      username: ['',
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
            Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$'), // ^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$
            RestrictedNameValidator(/birder/i)],
          asyncValidators: (control: AbstractControl) => this._validation.validateUsername(control.value),
          updateOn: 'blur'
        }
      ],
      email: ['', // ToDo: use the alternative format????????
        {
          validators: [Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
          asyncValidators: (control: AbstractControl) => this._validation.validateEmail(control.value),
          updateOn: 'blur'
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
            Validators.required,
            MatchOtherValidator('password') // makes css ng-valid label invalid if not matching
          ]
        }],
      }, { validator: ValidatePassword.passwordMatcher })
    })
  }

  userRegister_validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 20 characters long' },
      { type: 'pattern', message: 'Your username must be alphanumeric (no special characters) and must not contain spaces' },
      { type: 'restrictedName', message: 'Username may not contain the name "birder"' },
      { type: 'usernameTaken', message: 'XXXXXXXX username is taken XXXXXXXXX' },
      { type: 'serverError', message: 'Unable to connect to the server.  Please try again.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' },
      { type: 'emailTaken', message: 'XXXXXXXX email is taken XXXXXXXXX' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one number and one letter' }
      // { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'match', message: 'Passwords do not match' }
    ]
  };

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}