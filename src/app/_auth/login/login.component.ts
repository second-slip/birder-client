import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentErrorStateMatcher } from '../../_validators';
import { AuthenticationService } from '../authentication.service';
import { Ilogin } from './ilogin.dto';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  requesting: boolean;
  loginForm: FormGroup;
  errorMessage: string;
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  returnUrl: string;

  login_validation_messages = {
    'username': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' }
    ]
    // 'rememberMe': [
    //   { type: 'pattern', message: 'You must accept terms and conditions' }
    // ]
  };

  constructor(private readonly _service: LoginService
    , private readonly _authService: AuthenticationService
    , private readonly _router: Router
    , private readonly _route: ActivatedRoute
    , private readonly _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    this._createForms();
    this._authService.logout();


    // const model = <Ilogin>{
    //   password: '',
    //   rememberMe: false,
    //   userName: ''
    // }

    // this.onSubmit(model);
  }


  public onSubmit(formData: Ilogin): void {

    //console.log(formData);

    this._service.login(formData)
      .subscribe({
        next: (r) => {
          console.log(r);
          this._router.navigate([this.returnUrl]);
        },
        error: (e) => { console.log(e); },
        complete: () => { }
      })
  }

  private _createForms(): void {
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
}
