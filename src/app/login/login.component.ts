import { Component, OnInit } from '@angular/core';
import { Ilogin } from './ilogin.dto';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private _service: LoginService) { }

  ngOnInit(): void {
    const model = <Ilogin>{
      password: '',
      rememberMe: false,
      userName: ''
    }

    this._service.login(model)
      .subscribe({
        next: (r) => {
          console.log(r);
        },
        error: (e) => { console.log(e); },
        complete: () => { }
      })
  }
}
