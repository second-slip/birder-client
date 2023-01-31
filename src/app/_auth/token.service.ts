import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private TOKEN_KEY = 'jwt';

  constructor() { }

  public getToken(): string | null {
    return this._getToken();
  }

  private _getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public removeToken(): void {
    this._removeToken();
  }

  private _removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public addToken(token: string): void {
    this._addToken(token);
  }

  private _addToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}