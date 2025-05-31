import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BirdsDdlResponse } from 'src/app/testing/birds-helpers';
import { SelectSpeciesService } from './select-species.service';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

const apiUrl = `api/birds-list`;

describe('SelectSpeciesService', () => {
  let service: SelectSpeciesService;
  let controller: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(SelectSpeciesService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    controller.expectOne(apiUrl);
    expect(service).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(service.birds()).toEqual([]);
    // expect(service.loaded()).toBeFalsy();
    expect(service.error()).toBeFalsy();

    controller.expectOne(apiUrl);
  });

  it('fetches data and update state', () => {
    expect(service.birds()).toEqual([]);
    // expect(service.loaded()).toBeFalsy();
    expect(service.error()).toBeFalsy();

    controller.expectOne(apiUrl).flush(BirdsDdlResponse);

    expect(service.birds()).toEqual(BirdsDdlResponse);
    // expect(service.loaded()).toBeTruthy();
    expect(service.error()).toBeFalsy();
  });

  it('#getData should use GET to retrieve data', () => {
    const testRequest = controller.expectOne(apiUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('should update state with error response', () => {
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    expect(service.birds()).toEqual([]);
    // expect(service.loaded()).toBeFalsy();
    expect(service.error()).toBeFalsy();

    controller.expectOne(apiUrl).error(errorEvent, { status, statusText });

    expect(service.birds()).toEqual([]);
    // expect(service.loaded()).toBeFalsy();
    expect(service.error()).toBeTruthy();
  });

  it('should request data again with retry() method', () => {
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');
    controller.expectOne(apiUrl).error(errorEvent, { status, statusText });

    expect(service.birds()).toEqual([]);
    expect(service.error()).toBeTruthy();

    service.retry();

    controller.expectOne(apiUrl).flush(BirdsDdlResponse);

    expect(service.birds()).toEqual(BirdsDdlResponse);
    expect(service.error()).toBeFalsy();
  });
});
