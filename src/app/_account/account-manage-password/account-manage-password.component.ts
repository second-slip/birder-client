import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MatchOtherValidator, ValidatePassword } from 'src/app/_validators';
// import { AccountValidationService } from '../account-validation.service';
import { AccountService } from '../account.service';
import { IManagePassword } from './i-manage-password.dto';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-account-manage-password',
  templateUrl: './account-manage-password.component.html',
  styleUrls: ['./account-manage-password.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LoadingComponent,
    MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinner]
})
export class AccountManagePasswordComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public requesting = signal(false);// boolean;
    public submitProgress = signal('idle');// | 'success' | 'error' = 'idle';
  public form: FormGroup;

  constructor(private readonly _formBuilder: FormBuilder
    , private readonly _service: AccountService
    , private readonly _router: Router) { }

  ngOnInit(): void {
    this._createForms();
  }

  public onSubmit(formValue: any): void {
    if (!this.form.valid) return;
    this.requesting.set(true);

    const model = <IManagePassword>{
      oldPassword: formValue.oldPassword,
      newPassword: formValue.passwordGroup.password,
      confirmPassword: formValue.passwordGroup.confirmPassword
    };

    this._service.postChangePassword(model)
      .pipe(finalize(() => { this.requesting.set(false); }), takeUntil(this._subscription))
      .subscribe({
        next: () => {
          this.submitProgress.set('success');
          this._redirect();
        },
        error: () => { this.submitProgress.set('error'); }
      });
  }

  private _redirect(): void {
    this._router.navigate(['/login']);
  }

  private _createForms() {
    this.form = this._formBuilder.group({
      oldPassword: ['', { validators: [Validators.required], }],
      passwordGroup: this._formBuilder.group({
        password: ['', {
          validators: [
            Validators.minLength(8),
            Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%]+$')]
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


