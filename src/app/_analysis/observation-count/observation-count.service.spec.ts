import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { skip } from 'rxjs';
import { fakeIObservationCount, fakeObservationCountResponse } from 'src/app/testing/analysis-helpers';
import { IObservationCount } from './i-observation-count.dto';

import { ObservationCountService } from './observation-count.service';

const _apiUrl = 'api/ObservationAnalysis';

describe('ObservationCountService', () => {
    let controller: HttpTestingController;
    let service: ObservationCountService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ObservationCountService],
        });
        service = TestBed.inject(ObservationCountService);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });


    it('makes an http call', () => {
        // Arrange
        let actualObservationCount: IObservationCount | null | undefined; // undefined initial state to check if Observable emits
        let actualErrorState: boolean | undefined;
        let finalLoadingState: boolean | undefined;

        // Act
        service.getData(); // call http request method

        // We expect that the Observable emits an array that equals to the one from the API response:
        service.count.subscribe((observationCountObservable) => {
            actualObservationCount = observationCountObservable
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
        request.flush(fakeObservationCountResponse); // also paste the response object in with {}

        // Assert
        expect(actualObservationCount).toEqual(fakeIObservationCount);
        expect(actualErrorState).toBeFalse();
        //expect(finalLoadingState).toBeFalse();
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
        //expect(finalLoadingState).toBeFalse();
    });
});