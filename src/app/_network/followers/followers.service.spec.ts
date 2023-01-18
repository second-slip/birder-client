import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs';
import { apiNetworkUserArrayResponse, fakeNetworkUserModelArray } from 'src/app/testing/network-test-helpers';
import { INetworkUser } from '../i-network-user.dto';

import { FollowersService } from './followers.service';

const _username = 'testUsername'
const _apiUrl = `api/network/followers?requestedUsername=${_username}`;

describe('FollowersService', () => {
  let controller: HttpTestingController;
  let service: FollowersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FollowersService]
    });
    service = TestBed.inject(FollowersService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('makes an http call', () => {
    // Arrange
    let actualFollowers: INetworkUser[] | null | undefined; // undefined initial state to check if Observable emits
    let actualErrorState: boolean | undefined;

    // Act
    service.getData(_username); // call http request method

    // We expect that the Observable emits an array that equals to the one from the API response:
    service.getFollowers.subscribe((followersObservable) => {
      actualFollowers = followersObservable
    });

    service.isError
      .subscribe((error) => {
        actualErrorState = error;
      });

    const request = controller.expectOne({
      method: 'GET',
      url: _apiUrl
    });
    // Answer the request so the Observable emits a value.
    request.flush(apiNetworkUserArrayResponse); // also paste the response object in with {}

    // Assert
    expect(actualFollowers).toEqual(fakeNetworkUserModelArray);
    expect(actualErrorState).toBeFalse();
  });


  it('passes through errors', () => {
    // Arrange
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');
    let actualErrorState: boolean | undefined;

    // Act & Assert
    service.getData(_username); // call http request method

    service.isError.pipe(skip(1)) // skip first, default 'false' value emitted...
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

    expect(actualErrorState).toBeTrue();
  });
});