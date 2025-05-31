import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  lifeListModel,
  lifeListResponse,
} from 'src/app/testing/list-test-helpers';
import { ILifeList } from './i-life-list.dto';
import { LifeListService } from './life-list.service';
import { provideZonelessChangeDetection } from '@angular/core';

const _apiUrl = `api/list/life`;

describe('LifeListService', () => {
  let controller: HttpTestingController;
  let service: LifeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LifeListService, provideZonelessChangeDetection()],
    });
    service = TestBed.inject(LifeListService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('successfully requests the list', () => {
    // Arrange
    let actualList: ILifeList[] | null | undefined;
    let actualErrorState: boolean | undefined;

    // Act
    service.getData();

    service.lifeList.subscribe((list) => {
      actualList = list;
    });

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    const request = controller.expectOne({
      method: 'GET',
      url: _apiUrl,
    });

    request.flush(lifeListResponse);

    // Assert
    expect(actualList).toEqual(lifeListModel);
    expect(actualErrorState).toBeFalse();
  });

  it('passes through errors', () => {
    // Arrange
    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');

    let actualList: ILifeList[] | null | undefined;
    let actualErrorState: boolean | undefined;

    // Act & Assert
    service.getData();

    service.lifeList.subscribe((list) => {
      actualList = list;
    });

    service.isError.pipe().subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

    expect(actualErrorState).toBeTrue();
    expect(actualList).toBeNull();
  });
});
