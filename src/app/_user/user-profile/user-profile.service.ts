import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IUserProfile } from '../user-profile/i-user-profile.dto';

@Injectable()
export class UserProfileService implements OnDestroy {
  private _subscription = new Subject();
  private readonly _isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // private readonly _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _profile$: BehaviorSubject<IUserProfile | null> = new BehaviorSubject<IUserProfile | null>(null);

  constructor(private readonly _httpClient: HttpClient) { }

  public get isError(): Observable<boolean> {
    return this._isError$.asObservable();
  }

  // public get isLoading(): Observable<boolean> {
  //   return this._isLoading$.asObservable();
  // }

  public get getUserProfile(): Observable<IUserProfile | null> {
    return this._profile$.asObservable();
  }

  public getData(username: string | null): void {

    if (!username) {
      this._isError$.next(true);
      return;
    }

    const options = username ?
      { params: new HttpParams().set('requestedUsername', username) } : {};

    this._httpClient.get<IUserProfile>('api/UserProfile', options)
      .pipe(takeUntil(this._subscription)) //finalize(() => this._isLoading$.next(false)))
      .subscribe({
        next: (response) => { this._profile$.next(response); },
        error: (e) => { this._handleError(e); },
        complete: () => { if (this._isError$) this._isError$.next(false); }
      })
  }

  private _handleError(error: any) {
    this._isError$.next(true);
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}
