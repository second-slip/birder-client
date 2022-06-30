import { TestBed } from '@angular/core/testing';
import { ObservationFeedService } from './observation-feed.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { skip } from 'rxjs';
import { IObservationFeed } from './i-observation-feed.dto';
import { fakeIObservationFeed, fakeIObservationFeedWithOneElement, fakeObservationFeedResponse, fakeObservationFeedResponseWithOneElement } from '../testing/observation-feed-helper';

const _pageIndex = 1;
const _apiUrl = `api/ObservationFeed?pageIndex=${_pageIndex}&pageSize=10`;


describe('ObservationFeedService', () => {
    let controller: HttpTestingController;
    let service: ObservationFeedService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ObservationFeedService],
        });
        service = TestBed.inject(ObservationFeedService);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });


    it('makes an http call', () => {
        // Arrange
        let actualobservationFeed: IObservationFeed[] | null | undefined; // undefined initial state to check if Observable emits
        let actualErrorState: boolean | undefined;
        let finalLoadingState: boolean | undefined;
        let actualAllLoadedState: boolean | undefined;

        // Act
        service.getData(_pageIndex); // call http request method

        // We expect that the Observable emits an array that equals to the one from the API response:
        service.getObservations.subscribe((observationFeedObservable) => {
            actualobservationFeed = observationFeedObservable
        });

        service.isError
            .subscribe((error) => {
                actualErrorState = error;
            });

        service.isLoading.pipe(skip(1)) // skip first default 'true' value emitted...
            .subscribe((loading) => {
                finalLoadingState = loading;
            });

        service.allLoaded.pipe() // skip first default 'true' value emitted...
            .subscribe((loaded) => {
                actualAllLoadedState = loaded;
            });

        const request = controller.expectOne(_apiUrl);
        // Answer the request so the Observable emits a value.
        request.flush(fakeObservationFeedResponse); // also paste the response object in with {}

        // Assert
        expect(actualobservationFeed).toEqual(fakeIObservationFeed);
        expect(actualErrorState).toBeFalse();
        expect(finalLoadingState).toBeFalse();
        expect(actualAllLoadedState).toBeFalse();
    });

    it('#getData should use GET to retrieve data', () => {
        service.getData(1);
        const testRequest = controller.expectOne(_apiUrl);
        expect(testRequest.request.method).toEqual('GET');
    });

    it('passes through errors', () => {
        // Arrange
        const status = 500;
        const statusText = 'Internal Server Error';
        const errorEvent = new ErrorEvent('API error');
        let actualErrorState: boolean | undefined;
        let finalLoadingState: boolean | undefined;
        let actualAllLoadedState: boolean | undefined;

        // Act & Assert
        service.getData(_pageIndex); // call http request method

        service.isError.pipe(skip(1)) // skip first, default 'false' value emitted...
            .subscribe((error) => {
                actualErrorState = error;
            });

        service.isLoading.pipe(skip(1)) // skip first, default 'true' value emitted...
            .subscribe((loading) => {
                finalLoadingState = loading;
            });

        service.allLoaded.pipe() // skip first default 'true' value emitted...
            .subscribe((loaded) => {
                actualAllLoadedState = loaded;
            });

        controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

        expect(actualErrorState).toBeTrue();
        expect(finalLoadingState).toBeFalse();
        expect(actualAllLoadedState).toBeFalse();
    });



    // 
    it('updates allLoaded property to true', () => {
        // Arrange
        let actualobservationFeed: IObservationFeed[] | null | undefined; // undefined initial state to check if Observable emits
        let actualErrorState: boolean | undefined;
        let finalLoadingState: boolean | undefined;
        let actualAllLoadedState: boolean | undefined;

        // Act
        service.getData(_pageIndex); // call http request method

        // We expect that the Observable emits an array that equals to the one from the API response:
        service.getObservations.subscribe((observationFeedObservable) => {
            actualobservationFeed = observationFeedObservable
        });

        service.isError
            .subscribe((error) => {
                actualErrorState = error;
            });

        service.isLoading.pipe(skip(1)) // skip first default 'true' value emitted...
            .subscribe((loading) => {
                finalLoadingState = loading;
            });

        service.allLoaded.pipe(skip(1)) // skip first default 'true' value emitted...
            .subscribe((loaded) => {
                actualAllLoadedState = loaded;
            });

        const request = controller.expectOne(_apiUrl);
        // Answer the request so the Observable emits a value.
        request.flush(fakeObservationFeedResponseWithOneElement); // empty array response

        // Assert
        expect(actualobservationFeed).toEqual(fakeIObservationFeedWithOneElement);
        expect(actualErrorState).toBeFalse();
        expect(finalLoadingState).toBeFalse();

        expect(actualAllLoadedState).toBeTrue(); // <-- empty response is less than pageSize, so ALL LOADED
    });
});
