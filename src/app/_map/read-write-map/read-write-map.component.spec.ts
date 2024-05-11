import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapsModule } from '@angular/google-maps';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { expectText } from 'src/app/testing/element.spec-helper';
import { googleMapsApiResponse, testLatitude, testLongitude, testSearchAddress } from 'src/app/testing/map-tests-helpers';
import { GeocodeService } from '../geocode.service';
import { ReadWriteMapComponent } from './read-write-map.component';
import { WindowGeolocateService } from '../window-geolocate.service';

// note: problem with Google map control and asynchronous tests
// note: specs not async, fakeAsync(async () => {

describe('ReadWriteMapComponent', () => {

  describe('when map requests are successful', () => {

    let component: ReadWriteMapComponent;
    let fixture: ComponentFixture<ReadWriteMapComponent>;
    let fakeService: jasmine.SpyObj<GeocodeService>;
    let fakeWindowGeoService: jasmine.SpyObj<WindowGeolocateService>;

    fakeService = jasmine.createSpyObj<GeocodeService>(
      'GeocodeService',
      {
        geocode: of(googleMapsApiResponse), // undefined,
        googleApiResponseHelper: undefined,
        reverseGeocode: of(googleMapsApiResponse), // undefined,
      }
    );

    fakeWindowGeoService = jasmine.createSpyObj<WindowGeolocateService>(
      'WindowGeolocateService',
      {
        getCurrentPosition: undefined
      }
    );

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        providers: [
          { provide: GeocodeService, useValue: fakeService },
          { provide: WindowGeolocateService, useValue: fakeWindowGeoService }
        ],
        imports: [GoogleMapsModule, ReadWriteMapComponent],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ReadWriteMapComponent);
      component = fixture.componentInstance;
    });


    it('should create', () => {
      component.latitude = testLatitude;
      component.longitude = testLongitude;
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    // it('marker changed event should update marker if coordinates are available', () => {

    //   // event: google.maps.MapMouseEvent

    //   const u = jasmine.createSpyObj<google.maps.MapMouseEvent>('click', {domEvent: undefined, stop: undefined}, {latLng:})

    //   const y = <google.maps.MapMouseEvent>{
    //     latLng: {lat: 2, lng: 5 },
    //     stop: () => function(),
    //     domEvent: MouseEvent({})
    //   }


    // });

    // it('marker changed event should update marker if coordinates are available', () => {
    //   component.latitude = 1;
    //   component.longitude = -1;
    //   // fixture.detectChanges();
    //   // event: google.maps.MapMouseEvent

    //   const u = jasmine.createSpyObj<google.maps.MapMouseEvent>('click', { domEvent: undefined, stop: undefined });

    //   component.markerChanged(u);

    //   // fixture.detectChanges();

    //   expect(fakeService.reverseGeocode).toHaveBeenCalledTimes(2); // on component create then after method call
    //   expect(fakeService.reverseGeocode).toHaveBeenCalledWith(3, 4);
    // });

    // it('marker changed event should update marker if coordinates are NOT available', () => {
    //   component.latitude = testLatitude;
    //   component.longitude = testLongitude;
    //   // fixture.detectChanges();
    //   // event: google.maps.MapMouseEvent

    //   const u = jasmine.createSpyObj<google.maps.MapMouseEvent>('click', { domEvent: undefined, stop: undefined }, { latLng: undefined })

    //   //component.markerChanged(u);

    //   // fixture.detectChanges();

    //   expect(fakeService.reverseGeocode).toHaveBeenCalledTimes(2); // on component create then after method call
    //   expect(fakeService.reverseGeocode).toHaveBeenCalledWith(2,3);
    // });

    it('should display the map when valid', () => {
      component.latitude = testLatitude;
      component.longitude = testLongitude;
      fixture.detectChanges();

      // expect(component.markerStatus).toBe('success');

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


    describe('Search Address', () => {

      it('calls method with input value on button click ', () => {

        component.latitude = testLatitude;
        component.longitude = testLongitude;
        component.searchAddress = testSearchAddress;
        fixture.detectChanges();

        // button click...
        fixture.debugElement.query(By.css('.btn-search-address')).triggerEventHandler('click', null);

        expect(fakeService.geocode).toHaveBeenCalledOnceWith(testSearchAddress);
      });

      // it('does not call method when input value is falsy', ()  => {

      //   component.latitude = testLatitude;
      //   component.longitude = testLongitude;
      //   component.searchAddress = '';
      //   fixture.detectChanges();

      //   // button click...
      //   fixture.debugElement.query(By.css('.btn-search-address')).triggerEventHandler('click', null);

      //   expect(fakeService.geocode).not.toHaveBeenCalled();
      // });

    });



  });

  describe('ReadWriteMapComponent - window location service', () => {
    let component: ReadWriteMapComponent;
    let fixture: ComponentFixture<ReadWriteMapComponent>;
    let fakeService: jasmine.SpyObj<GeocodeService>;
    let fakeWindowGeoService: jasmine.SpyObj<WindowGeolocateService>;


    const setup = async (fakeMethodReturnValues?: jasmine.SpyObjMethodNames<WindowGeolocateService>) => {

      fakeService = jasmine.createSpyObj<GeocodeService>(
        'GeocodeService',
        {
          geocode: of(googleMapsApiResponse), // undefined,
          googleApiResponseHelper: undefined,
          reverseGeocode: of(googleMapsApiResponse), // undefined,
        }
      );

      fakeWindowGeoService = jasmine.createSpyObj<WindowGeolocateService>(
        'WindowGeolocateService',
        {
          getCurrentPosition: undefined,
          ...fakeMethodReturnValues
        }
      );

      await TestBed.configureTestingModule({
        providers: [
          { provide: GeocodeService, useValue: fakeService },
          { provide: WindowGeolocateService, useValue: fakeWindowGeoService }
        ],
        imports: [GoogleMapsModule, ReadWriteMapComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(ReadWriteMapComponent);
      component = fixture.componentInstance;

      component.latitude = testLatitude;
      component.longitude = testLongitude;
      fixture.detectChanges();
    };

    it('should create', async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    describe('use window geolocation service', () => {

      it('calls getCurrentPosition method on button click ', async () => {
        await setup();

        // button click...
        fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

        expect(fakeWindowGeoService.getCurrentPosition).toHaveBeenCalledTimes(1);
      });

      it('clears the geoLocation error message if there is one', async () => {
        // Arrange
        await setup();

        component.geoError = 'geo error message';

        // button click...
        fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

        expect(fakeWindowGeoService.getCurrentPosition).toHaveBeenCalledTimes(1);
        expect(component.geoError).toBeFalsy();
      });

      it('handles NEXT notification', async () => {
        // Arrange
        const expected = <GeolocationPosition>{
          coords: { latitude: 1.6578, longitude: -1.567 },
          timestamp: 5467
        };

        await setup({
          getCurrentPosition: of(expected)
        });

        // button click...
        fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

        expect(fakeWindowGeoService.getCurrentPosition).toHaveBeenCalledTimes(1);
        expect(component.latitude).toEqual(expected.coords.latitude);
        expect(component.longitude).toEqual(expected.coords.longitude);
        expect(component.geoError).toBeFalsy();
        expect(fakeService.reverseGeocode).toHaveBeenCalledTimes(2); // on component create then after method call
        expect(fakeService.reverseGeocode).toHaveBeenCalledWith(expected.coords.latitude, expected.coords.longitude);
      });

      it('handles ERROR notification', async () => {
        // Arrange
        const expected: string = 'error notification by service';

        await setup({
          getCurrentPosition: throwError(() => new Error(expected))
        });

        // button click...
        fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

        expect(fakeWindowGeoService.getCurrentPosition).toHaveBeenCalledTimes(1);
        expect(component.geoError).toBeTruthy();
        expect(fakeService.reverseGeocode).toHaveBeenCalledTimes(1); // once on component create
      });

      describe('map intercativity', () => {
        it('calls markerChanged method on marker change', async () => {
          await setup();

          spyOn(component, 'markerChanged');
          const event = jasmine.createSpyObj<google.maps.MapMouseEvent>('click', { domEvent: undefined, stop: undefined });
          component.markerChanged(event);
          expect(component.markerChanged).toHaveBeenCalledTimes(1);
          expect(component.markerChanged).toHaveBeenCalledOnceWith(event);
        });
      })
    });
  });



  // .......................................................................................

  describe('ReadWriteMapComponent - window location service', () => {
    let component: ReadWriteMapComponent;
    let fixture: ComponentFixture<ReadWriteMapComponent>;
    let fakeService: jasmine.SpyObj<GeocodeService>;
    let fakeWindowGeoService: jasmine.SpyObj<WindowGeolocateService>;


    const setup = async (fakeMethodReturnValues?: jasmine.SpyObjMethodNames<WindowGeolocateService>) => {

      fakeService = jasmine.createSpyObj<GeocodeService>(
        'GeocodeService',
        {
          geocode: undefined,
          googleApiResponseHelper: undefined,
          reverseGeocode: undefined,
        }
      );

      fakeWindowGeoService = jasmine.createSpyObj<WindowGeolocateService>(
        'WindowGeolocateService',
        {
          getCurrentPosition: undefined,
          ...fakeMethodReturnValues
        }
      );

      await TestBed.configureTestingModule({
        providers: [
          { provide: GeocodeService, useValue: fakeService },
          { provide: WindowGeolocateService, useValue: fakeWindowGeoService }
        ],
        imports: [GoogleMapsModule, ReadWriteMapComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(ReadWriteMapComponent);
      component = fixture.componentInstance;

      component.latitude = testLatitude;
      component.longitude = testLongitude;
      fixture.detectChanges();
    };

    it('should create', async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    // describe('map interactivity', () => {

    // it('calls getCurrentPosition method on button click ', async () => {
    //   await setup();

    //   spyOn(component, 'markerChanged');
    //   const event = jasmine.createSpyObj<google.maps.MapMouseEvent>('click', { domEvent: undefined, stop: undefined });
    //   component.markerChanged(event);
    //   expect(component.markerChanged).toHaveBeenCalledTimes(1);
    //   expect(component.markerChanged).toHaveBeenCalledOnceWith(event);
    // });

    // });
  });
});