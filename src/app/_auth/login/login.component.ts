import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Ilogin } from './ilogin.dto';
import { LoginService } from './login.service';
import { AuthenticationFailureReason } from '../authentication-failure-reason';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { IAuthenticationResult } from '../i-authentication-result.dto';
import { TokenService } from '../token.service';
import { LoadingComponent } from '../../_loading/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, LoadingComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatCheckboxModule],
})
export class LoginComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();

  public requesting: boolean;
  public loginForm: FormGroup;
  public submitProgress: 'idle' | 'success' | 'error' = 'idle';

  constructor(private readonly _service: LoginService
    , private readonly _token: TokenService
    , private readonly _authService: AuthenticationService
    , private readonly _router: Router
    , private readonly _formBuilder: FormBuilder
    , private readonly _navigation: NavigationService) { }

  ngOnInit(): void {
    this._authService.logout();
    this._createForm();
  }

  public onSubmit(formData: any): void {
    if (!this.loginForm.valid) return;

    //  try / catch
    const model = this._mapFormToModel(formData)

    this.requesting = true;

    this._service.login(model)
      .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this.submitProgress = 'success';
          this._handleSuccess(r);
          this._navigation.back();
        },
        error: (e) => {
          this.submitProgress = 'error';
          this._handleError(e);
        }
      })
  }

  private _mapFormToModel(formData: any): Ilogin {
    return <Ilogin>{
      userName: formData.username,
      password: formData.password,
      rememberMe: formData.rememberMe
    }
  }

  private _handleSuccess(response: IAuthenticationResult): void {
    this._token.addToken(response.authenticationToken);
    this._authService.checkAuthStatus();
  }

  private _handleError(error: IAuthenticationResult): void {
    if (error.failureReason == AuthenticationFailureReason.EmailConfirmationRequired) {
      this._router.navigate(['/confirm-email']);
    }
  }

  private _createForm(): void {
    this.loginForm = this._formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}