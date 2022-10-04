import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthenticationResult } from '../i-authentication-result.dto';
import { Ilogin } from './ilogin.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private readonly _http: HttpClient) { }

  public login(viewModel: Ilogin): Observable<IAuthenticationResult> {
    return this._http.post<IAuthenticationResult>('api/authentication/login', viewModel, httpOptions);
  }
}