import { TestBed } from '@angular/core/testing';

import { DateHelpersService } from './date-helpers.service';

describe('DateHelpersService', () => {
  let service: DateHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateHelpersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('creates a date object with date from date input and time from time input', () => {
    //new Date(year, month, day, hours, minutes, seconds, milliseconds);
    const date = new Date(2018, 11, 24, 20, 33, 30, 0);
    const time = new Date(2020, 10, 13, 10, 53, 20, 0);

    const expected = new Date(
      // date from date object
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      // time from time object
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );

    // Act
    var actual = service.combineDateTime(date, time);

    expect(actual).toEqual(expected);
  });

  it('creates a date object with date from date input and time from time input (inverse objects)', () => {
    //new Date(year, month, day, hours, minutes, seconds, milliseconds);
    const time = new Date(2018, 11, 24, 20, 33, 30, 0);
    const date = new Date(2020, 10, 13, 10, 53, 20, 0);

    const expected = new Date(
      // date from date object
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      // time from time object
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );

    // Act
    var actual = service.combineDateTime(date, time);

    expect(actual).toEqual(expected);
  });
});
