import { TestBed } from '@angular/core/testing';

import { WindowGeolocateService } from './window-geolocate.service';

describe('WindowGeolocateService', () => {
  let service: WindowGeolocateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowGeolocateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

// describe('Get Current Location', () => {

//   it('calls ', () => {
//     spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
//       const position = { coords: { latitude: 0, longitude: 0 } };
//       args[0](position);
//     });

//     component.latitude = testLatitude;
//     component.longitude = testLongitude;
//     fixture.detectChanges();

//     // button click...
//     fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

//     expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();

//     expect(fakeService.reverseGeocode).toHaveBeenCalled();
//   });

//   it('clears geoError property if it is truthy', () => {
//     spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
//       const position = { coords: { latitude: 0, longitude: 0 } };
//       args[0](position);
//     });

//     component.latitude = testLatitude;
//     component.longitude = testLongitude;
//     component.geoError = 'truthy';
//     fixture.detectChanges();

//     // button click...
//     fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

//     fixture.detectChanges();

//     expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
//     expect(component.geoError).toBeFalsy();
//   });

//   it('y error', () => {
//     spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
//       const error = {
//         code: 1,
//         message: 'GeoLocation Error',
//       };
//       args[1](error);
//     });

//     component.latitude = testLatitude;
//     component.longitude = testLongitude;
//     fixture.detectChanges();

//     // button click...
//     fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

//     expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
//     expect(window.navigator.geolocation.getCurrentPosition).toThrowError();

//     fixture.detectChanges();

//     expectText(fixture, 'geo-error', 'User denied the request for Geolocation...');
//   });

//   it('y error', () => {
//     spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
//       const error = {
//         code: 2,
//         message: 'GeoLocation Error',
//       };
//       args[1](error);
//     });

//     component.latitude = testLatitude;
//     component.longitude = testLongitude;

//     fixture.detectChanges();
//     // button click...
//     fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

//     expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
//     expect(window.navigator.geolocation.getCurrentPosition).toThrowError();

//     fixture.detectChanges();

//     expectText(fixture, 'geo-error', 'Location information is unavailable...');
//   });

//   it('y error', () => {
//     spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
//       const error = {
//         code: 3,
//         message: 'GeoLocation Error',
//       };
//       args[1](error);
//     });

//     component.latitude = testLatitude;
//     component.longitude = testLongitude;
//     fixture.detectChanges();

//     // button click...
//     fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

//     expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
//     expect(window.navigator.geolocation.getCurrentPosition).toThrowError();

//     fixture.detectChanges();

//     expectText(fixture, 'geo-error', 'The request to get user location timed out...');
//   });

//   it('y error', () => {
//     spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
//       const error = {};
//       args[1](error);
//     });

//     component.latitude = testLatitude;
//     component.longitude = testLongitude;
//     fixture.detectChanges();

//     // button click...
//     fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);

//     expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
//     expect(window.navigator.geolocation.getCurrentPosition).toThrowError();

//     fixture.detectChanges();

//     expectText(fixture, 'geo-error', 'An error occurred with Geolocation...');
//   });

//   it('clears geoError property if it is truthy', () => {
//     spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
//       const error = {};
//       args[1](error);
//     });

//     component.latitude = testLatitude;
//     component.longitude = testLongitude;
//     component.geoError = 'truthy';
//     fixture.detectChanges();

//     // button click...
//     fixture.debugElement.query(By.css('.btn-get-location')).triggerEventHandler('click', null);


//     fixture.detectChanges();

//     expectText(fixture, 'geo-error', 'An error occurred with Geolocation...');
//   });


// });
