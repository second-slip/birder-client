import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateHelpersService {
  public combineDateTime(date: Date, time: Date): Date {
    return new Date(
      `${new Date(date).toDateString()} ${new Date(time).toTimeString()}`
    );
  }
}