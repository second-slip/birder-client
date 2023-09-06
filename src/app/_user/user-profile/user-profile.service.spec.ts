import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { username, userProfileModel } from 'src/app/testing/userProfile-tests-helpers';
import { IUserProfile } from './i-user-profile.dto';
import { UserProfileService } from './user-profile.service';

const apiUrl = `api/userprofile?requestedusername=${username}`;

describe('UserProfileService', () => {
  let service: UserProfileService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserProfileService]
    });
    service = TestBed.inject(UserProfileService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches data', () => {
    let actualRecordingsState: IUserProfile | null | undefined;
    let actualErrorState: boolean | undefined;

    service.getData(username);

    service.getUserProfile.subscribe((otherResult) => {
      actualRecordingsState = otherResult;
    });

    service.isError
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(apiUrl).flush(userProfileModel);

    expect(actualRecordingsState).toEqual(userProfileModel);
    expect(actualErrorState).toBeFalse();
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData(username);
    const testRequest = controller.expectOne(apiUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('passes the errors through', () => {
    let actualRecordingsState: IUserProfile | null | undefined;
    let actualErrorState: boolean | undefined;

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    service.getData(username);

    service.getUserProfile.subscribe((otherResult) => {
      actualRecordingsState = otherResult;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectOne(apiUrl).error(errorEvent, { status, statusText });

    expect(actualRecordingsState).toEqual(null);
    expect(actualErrorState).toBeTrue();
  });

  it('returns error if username argument is null', () => {
    const username = null;
    let actualRecordingsState: IUserProfile | null | undefined;
    let actualErrorState: boolean | undefined;

    service.getData(username);

    service.getUserProfile.subscribe((otherResult) => {
      actualRecordingsState = otherResult;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectNone(`api/UserProfile?requestedUsername=${username}`);

    expect(actualRecordingsState).toEqual(null);
    expect(actualErrorState).toBeTrue();
  });

  it('returns error if username argument is empty string', () => {
    const username = '';
    let actualRecordingsState: IUserProfile | null | undefined;
    let actualErrorState: boolean | undefined;

    service.getData(username);

    service.getUserProfile.subscribe((otherResult) => {
      actualRecordingsState = otherResult;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectNone(`api/UserProfile?requestedUsername=${username}`);

    expect(actualRecordingsState).toEqual(null);
    expect(actualErrorState).toBeTrue();
  });
});