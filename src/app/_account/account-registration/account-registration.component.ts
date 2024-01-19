import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { MatchOtherValidator, RestrictedNameValidator, ValidatePassword } from 'src/app/_validators';
import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { IAccountRegistration } from './i-account-registration';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-account-registration',
    templateUrl: './account-registration.component.html',
    styleUrls: ['./account-registration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, FormsModule, ReactiveFormsModule, NgFor, RouterLink, LoadingComponent]
})
export class AccountRegistrationComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public requesting: boolean;
  public userRegisterForm: FormGroup;
  public submitProgress: 'idle' | 'success' | 'error' = 'idle';

  constructor(private readonly _formBuilder: FormBuilder
    , private readonly _service: AccountService
    , readonly _validation: AccountValidationService
    , private readonly _router: Router) { }

  ngOnInit() {
    this._createForms();
  }

  public onSubmit(value: any): void {

    // console.log(findInvalidControls(this.userRegisterForm));
    // console.log(this.userRegisterForm.value);
    // console.log(this.userRegisterForm.valid);

    if (!this.userRegisterForm.valid) return;

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
          next: () => {
            this.submitProgress = 'success';
            this._router.navigate(['/confirm-email']);
          },
          error: () => { this.submitProgress = 'error'; }
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
      email: ['', // ToDo: use the alternative format?
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
      }, { validators: ValidatePassword.passwordMatcher })
    })
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}