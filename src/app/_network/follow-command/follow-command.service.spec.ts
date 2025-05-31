import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { fakeNetworkUserModel } from 'src/app/testing/network-test-helpers';
import { INetworkUser } from '../i-network-user.dto';

import { FollowCommandService } from './follow-command.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('FollowCommandService', () => {
  let service: FollowCommandService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(FollowCommandService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('posts the follow request', () => {
    let result: INetworkUser | null | undefined;
    service.postFollowUser(fakeNetworkUserModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/network/follow',
    });

    expect(request.request.body).toEqual(fakeNetworkUserModel);
    request.flush(fakeNetworkUserModel);
    expect(result).toBe(fakeNetworkUserModel);
  });

  it('posts the unfollow request', () => {
    let result: INetworkUser | null | undefined;
    service.postUnfollowUser(fakeNetworkUserModel).subscribe((otherResult) => {
      result = otherResult;
    });

    const request = controller.expectOne({
      method: 'POST',
      url: 'api/network/unfollow',
    });

    expect(request.request.body).toEqual(fakeNetworkUserModel);
    request.flush(fakeNetworkUserModel);
    expect(result).toBe(fakeNetworkUserModel);
  });

  it('passes the errors through', () => {
    const errors: HttpErrorResponse[] = [];
    const recordError = (error: HttpErrorResponse) => {
      errors.push(error);
    };

    service
      .postFollowUser(fakeNetworkUserModel)
      .subscribe({ next: fail, error: recordError, complete: fail });
    service
      .postUnfollowUser(fakeNetworkUserModel)
      .subscribe({ next: fail, error: recordError, complete: fail });

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    const requests = controller.match(() => true);
    requests.forEach((request) => {
      request.error(errorEvent, { status, statusText });
    });

    expect(errors.length).toBe(2);
    errors.forEach((error) => {
      expect(error.error).toBe(errorEvent);
      expect(error.status).toBe(status);
      expect(error.statusText).toBe(statusText);
    });
  });
});
