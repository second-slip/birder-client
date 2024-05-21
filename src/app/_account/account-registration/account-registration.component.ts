import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { MatchOtherValidator, RestrictedNameValidator, ValidatePassword } from 'src/app/_validators';
import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { IAccountRegistration } from './i-account-registration';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-account-registration',
  templateUrl: './account-registration.component.html',
  styleUrls: ['./account-registration.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, LoadingComponent, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinner]
})
export class AccountRegistrationComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public requesting: boolean;
  public form: FormGroup;
  public submitProgress: 'idle' | 'success' | 'error' = 'idle';

  constructor(private readonly _formBuilder: FormBuilder
    , private readonly _service: AccountService
    , readonly _validation: AccountValidationService
    , private readonly _router: Router) { }

  ngOnInit() {
    this._createForms();
  }

  public onSubmit(value: any): void {
    if (!this.form.valid) return;

    this.requesting = true;

    try {
      const model = this._mapModel(value);

      this.requesting = true;

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
      this.submitProgress = 'error';
    }
  }

  private _mapModel(value: any): IAccountRegistration {
    return <IAccountRegistration>{
      userName: value.username,
      email: value.email,
      password: value.passwordGroup.password,
      confirmPassword: value.passwordGroup.confirmPassword
    };
  }

  private _createForms() {
    this.form = this._formBuilder.group({
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
      email: ['',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: (control: AbstractControl) => this._validation.validateEmail(control.value),
          updateOn: 'blur'
        }
      ],
      passwordGroup: this._formBuilder.group({
        password: ['', [
          Validators.minLength(8),
          Validators.required, // regex: accept letters, numbers and !@#$%.  Must have at least one letter and number
          Validators.pattern('^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%]+$')] // ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ],
        confirmPassword: ['', [
          Validators.required, MatchOtherValidator('password')]
        ],
      }, { validators: ValidatePassword.passwordMatcher })
    })
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}