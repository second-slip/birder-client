import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AccountService } from '../account.service';
import { IUserEmail } from '../i-user-email.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinner]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public form: FormGroup;
  public requesting = signal(false);
  public submitProgress = signal('idle');

  constructor(private _formBuilder: FormBuilder, private _service: AccountService) { }

  ngOnInit(): void {
    this._createForms();
  }

  public onSubmit(): void {
    const model = this._mapToModel();

    if (!model) return this.submitProgress.set('error');

    this.requesting.set(true);

    this._service.requestPasswordReset(model)
      .pipe(finalize(() => { this.requesting.set(false); }), takeUntil(this._subscription))
      .subscribe({
        next: () => { this.submitProgress.set('success'); },
        error: () => { this.submitProgress.set('error'); }
      });
  }

  private _mapToModel(): IUserEmail | void {
    if (!this.form.valid) return;

    try {
      return <IUserEmail>{
        email: this.form.value.email,
      };
    }
    catch (error) {
      return this.submitProgress.set('error');
    }
  }

  private _createForms(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}