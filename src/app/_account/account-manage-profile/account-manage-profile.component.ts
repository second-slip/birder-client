import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { RestrictedNameValidator } from 'src/app/_validators';
import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { IManageProfile } from './i-manage-profile.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-account-manage-profile',
  templateUrl: './account-manage-profile.component.html',
  styleUrls: ['./account-manage-profile.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinner]
})
export class AccountManageProfileComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();

  public form: FormGroup;
  public requesting = signal(false);
  public submitProgress = signal('idle');
  public dataFetchError = signal(false);

  constructor(private _formBuilder: FormBuilder
    , private readonly _service: AccountService
    , readonly _validation: AccountValidationService
    , private readonly _authService: AuthenticationService
    , private readonly _router: Router) { }

  ngOnInit(): void {
    this._getProfile();
  }

  public onSubmit(): void {
    const model = this._mapToModel();

    if (!model) return this.submitProgress.set('error');

    this.requesting.set(true);

    this._service.postUpdateProfile(model)
      .pipe(finalize(() => { this.requesting.set(false); }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this.submitProgress.set('success');
          this._redirect(r);
        },
        error: () => { this.submitProgress.set('error'); }
      });
  }

  private _mapToModel(): IManageProfile | void {
    if (!this.form.valid) return;

    try {
      return <IManageProfile>{
        userName: this.form.value.username,
        email: this.form.value.email,
        emailConfirmationRequired: true
      };
    }
    catch (error) {
      return this.submitProgress.set('error');
    }
  }

  private _redirect(emailConfirmationRequired: boolean): void {
    if (emailConfirmationRequired) {
      this._authService.logout();
      this._router.navigate(['/confirm-email']);
    } else {
      this._router.navigate(['/login']);
    }
  }

  private _getProfile(): void {
    this._service.getUserProfile()
      .pipe(finalize(() => { this.requesting.set(false); }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this.form = this._createForm(r);
        },
        error: () => { this.dataFetchError.set(true); }
      });
  }

  private _createForm(user: IManageProfile): FormGroup {
    return this._formBuilder.group({
      username: [
        user.userName,
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
      email: [
        user.email,
        {
          validators: [Validators.required,
          Validators.email],
          asyncValidators: (control: AbstractControl) => this._validation.validateEmail(control.value),
          updateOn: 'blur'
        }
      ]
    });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}