import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs';
import { fakeIObservationTopFive, fakeTopObservationsResponse } from 'src/app/testing/analysis-helpers';
import { IObservationTopFive } from './i-observation-top-five.dto';
import { ObservationTopFiveService } from './observation-top-five.service';

const _apiUrl = 'api/List/TopObservationsList';

describe('ObservationTopFiveService', () => {
    let controller: HttpTestingController;
    let service: ObservationTopFiveService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ObservationTopFiveService],
        });
        service = TestBed.inject(ObservationTopFiveService);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });


    it('makes an http call', () => {
        // Arrange
        let actualObservationTopFiveObservable: IObservationTopFive | null | undefined; // undefined initial state to check if Observable emits
        let actualErrorState: boolean | undefined;
        let finalLoadingState: boolean | undefined;

        // Act
        service.getData(); // call http request method

        // We expect that the Observable emits an array that equals to the one from the API response:
        service.getTop.subscribe((observationTopFiveObservable) => {
            actualObservationTopFiveObservable = observationTopFiveObservable
        });

        service.isError
            .subscribe((error) => {
                actualErrorState = error;
            });

        // service.isLoading.pipe(skip(1)) // skip first default 'true' value emitted...
        //     .subscribe((loading) => {
        //         finalLoadingState = loading;
        //     });

        const request = controller.expectOne(_apiUrl); // _apiUrl);
        // Answer the request so the Observable emits a value.
        request.flush(fakeTopObservationsResponse); // also paste the response object in with {}

        // Assert
        expect(actualObservationTopFiveObservable).toEqual(fakeIObservationTopFive);
        expect(actualErrorState).toBeFalse();
        // expect(finalLoadingState).toBeFalse();
    });

    it('#getData should use GET to retrieve data', () => {
        service.getData();
        const testRequest = controller.expectOne(_apiUrl);
        expect(testRequest.request.method).toEqual('GET');
    });

    it('passes through errors', () => {
        // Arrange
        const status = 500;
        const statusText = 'Internal Server Error';
        const errorEvent = new ErrorEvent('API error');
        let actualErrorState: boolean | undefined;
        let finalLoadingState: boolean | undefined;;

        // Act & Assert
        service.getData(); // call http request method

        service.isError.pipe(skip(1)) // skip first, default 'false' value emitted...
            .subscribe((error) => {
                actualErrorState = error;
            });

        // service.isLoading.pipe(skip(1)) // skip first, default 'true' value emitted...
        //     .subscribe((loading) => {
        //         finalLoadingState = loading;
        //     });

        controller.expectOne(_apiUrl).error(errorEvent, { status, statusText });

        expect(actualErrorState).toBeTrue();
        // expect(finalLoadingState).toBeFalse();
    });
});
