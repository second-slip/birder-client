import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { GoogleMapsModule } from '@angular/google-maps';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { expectText, findEl } from 'src/app/testing/element.spec-helper';
import { googleMapsApiResponse, testLatitude, testLongitude } from 'src/app/testing/map-tests-helpers';
import { GeocodeService } from '../geocode.service';

import { ReadWriteMapComponent } from './read-write-map.component';

// note: problem with Google map control & and asynchronous tests

describe('ReadWriteMapComponent', () => {



  describe('when map requests are successful', () => {

    let component: ReadWriteMapComponent;
    let fixture: ComponentFixture<ReadWriteMapComponent>;
    let fakeService: jasmine.SpyObj<GeocodeService>;

    // let navigator_spy = spyOn(window.navigator.geolocation, 'getCurrentPosition');

    fakeService = jasmine.createSpyObj<GeocodeService>(
      'GeocodeService',
      {
        geocode: of(googleMapsApiResponse), // undefined,
        googleApiResponseHelper: undefined,
        reverseGeocode: of(googleMapsApiResponse), // undefined,
      }
    );

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ReadWriteMapComponent],
        providers: [
          { provide: GeocodeService, useValue: fakeService }
        ],
        imports: [GoogleMapsModule],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ReadWriteMapComponent);
      component = fixture.componentInstance;

      // spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
      //   const position = { coords: { latitude: 0, longitude: 0 } };
      //   args[0](position);
      // })
    });


    it('should create', () => {
      component.latitude = testLatitude;
      component.longitude = testLongitude;
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(component.markerStatus).toBe('success');
    });

    it('should display the map when valid', () => {
      component.latitude = testLatitude;
      component.longitude = testLongitude;
      fixture.detectChanges();

      expect(component.markerStatus).toBe('success');

      expect(component.latitude).toBe(testLatitude);
      expect(component.longitude).toBe(testLongitude);

      // it's called twice.  Once when the marker is added, then again because the marker is changed (i.e.: markerChanged)
      expect(fakeService.reverseGeocode).toHaveBeenCalledWith(testLatitude, testLongitude); // OnceWith(testLatitude, testLongitude);
      expect(fakeService.googleApiResponseHelper).toHaveBeenCalled();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="location"]')?.textContent).toBeDefined();
      expectText(fixture, 'location-text', 'London, UK');

      const { debugElement } = fixture;
      const map = debugElement.query(By.css('google-map'));
      expect(map).toBeDefined();
    });

    describe('COUGAR XXXXXXXXXXXXXXXXXXX', () => {

      // beforeEach(() => {
      //   spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
      //     const position = { coords: { latitude: 0, longitude: 0 } };
      //     args[0](position);
      //   })
      // });


      it('x', () => {
        spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
          const position = { coords: { latitude: 0, longitude: 0 } };
          args[0](position);
        });

        component.latitude = testLatitude;
        component.longitude = testLongitude;
        fixture.detectChanges();

        // button click...
        fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);


        // var f = new Geolocation();
        expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        //..should call method
        // expect(component.getCurrentPosition).toHaveBeenCalled();

        // spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
        //   const position = { coords: { latitude: 0, longitude: 0 } };
        //   args[0](position);
        // })

      });

      it('y', () => {
        spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
          const position = { coords: { latitude: 0, longitude: 0 } };
          args[0](position);
        });

        component.latitude = testLatitude;
        component.longitude = testLongitude;
        fixture.detectChanges();

        // button click...
        fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);


        // var f = new Geolocation();
        expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        //..should call method
        // expect(component.getCurrentPosition).toHaveBeenCalled();

        // spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
        //   const position = { coords: { latitude: 0, longitude: 0 } };
        //   args[0](position);
        // })

      });


    });


  });
});









// describe('ReadWriteMapComponent --- XXXXXXXXXXXXXXXXX', () => {
//   let component: ReadWriteMapComponent;
//   let fixture: ComponentFixture<ReadWriteMapComponent>;

//   let fakeService: jasmine.SpyObj<GeocodeService>;

//   fakeService = jasmine.createSpyObj<GeocodeService>(
//     'GeocodeService',
//     {
//       geocode: of(googleMapsApiResponse), // undefined,
//       googleApiResponseHelper: 'undefined',
//       reverseGeocode: of(googleMapsApiResponse), // undefined,
//     }
//   );

//   const setup = async () => {



//     // beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ReadWriteMapComponent],
//       imports: [GoogleMapsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         { provide: GeocodeService, useValue: fakeService }
//       ]
//     })
//       .compileComponents();
//     // });

//     // beforeEach(() => {
//     fixture = TestBed.createComponent(ReadWriteMapComponent);
//     component = fixture.componentInstance;

//     component.latitude = 0.6;
//     component.longitude = 0.4;

//     fixture.detectChanges();
//   };


//   it('should create', fakeAsync(async () => {
//     await setup();
//     fixture.whenStable().then(() => {
//     expect(component).toBeTruthy();
//     });
//   }));
// });