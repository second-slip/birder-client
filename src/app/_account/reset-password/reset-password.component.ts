import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MatchOtherValidator, ValidatePassword } from 'src/app/_validators';
import { AccountService } from '../account.service';
import { IResetPassword } from './i-reset-password.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinner]
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public form: FormGroup;
  public requesting = signal(false);
  public submitProgress = signal('idle');

  constructor(readonly _service: AccountService
    , private _formBuilder: FormBuilder
    , private readonly _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this._createForms(pmap.get('code'));
    });
  }

  public onSubmit(): void {
    const model = this._mapToModel();

    if (!model) return this.submitProgress.set('error');

    this.requesting.set(true);

    this._service.resetPassword(model)
      .pipe(finalize(() => { this.requesting.set(false); }), takeUntil(this._subscription))
      .subscribe({
        next: () => { this.submitProgress.set('success'); },
        error: () => { this.submitProgress.set('error'); }
      });
  }

  private _mapToModel(): IResetPassword | void {
    if (!this.form.valid) return;

    try {
      return <IResetPassword>{
        email: this.form.value.email,
        password: this.form.value.passwordGroup.password,
        confirmPassword: this.form.value.passwordGroup.confirmPassword,
        code: this.form.value.code
      };
    }
    catch (error) {
      return this.submitProgress.set('error');
    }
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }

  private _createForms(code: string | null) {
    this.form = this._formBuilder.group({
      email: ['',
        {
          validators: [Validators.required, Validators.email]
        }
      ],
      code: [code,
        {
          validators: [Validators.required]
        }
      ],
      passwordGroup: this._formBuilder.group({
        password: ['', {
          validators: [
            Validators.minLength(8),
            Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9!@#$%]+$')]
        }],
        confirmPassword: ['', {
          validators: [
            Validators.required, MatchOtherValidator('password')]
        }],
      }, { validators: ValidatePassword.passwordMatcher })
    })
  }
}