import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Ilogin } from './ilogin.dto';
import { LoginService } from './login.service';
import { AuthenticationFailureReason } from '../authentication-failure-reason';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  private _subscription = new Subject();
  public requesting: boolean;
  public loginForm: FormGroup;
  public errorObject = null;

  login_validation_messages = {
    'username': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' }
    ]
  };

  constructor(private readonly _service: LoginService
    , private readonly _authService: AuthenticationService
    , private readonly _router: Router
    , private readonly _formBuilder: FormBuilder
    , private readonly _navigation: NavigationService) { }

  ngOnInit(): void {
    this._createForm();
    this._authService.logout();
  }

  public onSubmit(formData: Ilogin): void {
    this.requesting = true;
    this.loginForm.disable();
    if (this.errorObject) this.errorObject = null;

    this._service.login(formData)
      .pipe(finalize(() => { this.requesting = false; this.loginForm.enable(); }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => { this._navigation.back(); },
        error: (e) => { this.errorObject = e; this._handleError(e); },
        complete: () => { }
      })
  }


  // ToDo: decide on the best approach.
  // Not all errors will be the AuthenticationFailureReason - what about connectivity errors etc?
  private _handleError(error: AuthenticationFailureReason): void {
    switch (error) {
      case AuthenticationFailureReason.EmailConfirmationRequired: {
        // this.toast.info('You must confirm your email address before you can login.', 'Confirm your email', {
        //   timeOut: 8000
        // });
        this._router.navigate(['/confirm-email']);
        break;
      }
      case AuthenticationFailureReason.LockedOut: {
        break;
      }
      default: {
        break;
      }
    }
  }

  private _createForm(): void {
    this.loginForm = this._formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      rememberMe: new FormControl(false)
    });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}