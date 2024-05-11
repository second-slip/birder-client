import { TestBed } from '@angular/core/testing';
import { WindowGeolocateService } from './window-geolocate.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WindowGeolocateService', () => {
  let service: WindowGeolocateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowGeolocateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get Current Location', () => {

    it('calls window.navigator.geolocation.getCurrentPosition when method is called', () => {

      const expected = <GeolocationPosition>{
        coords: { latitude: 0, longitude: 0 },
        timestamp: 5467
      }

      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
        // const position = { coords: { latitude: 0, longitude: 0 } };
        args[0](expected);
      });

      let actual: any | undefined;

      service.getCurrentPosition().subscribe((otherResult) => {
        // console.log(otherResult);
        actual = otherResult;
      });

      // Assert
      expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });

    it('getCurrentPosition NEXT returns GeolocationPosition object', () => {

      const expected = <GeolocationPosition>{
        coords: { latitude: 0, longitude: 0 },
        timestamp: 5467
      }

      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
        args[0](expected);
      });

      let actual: any | undefined;

      service.getCurrentPosition().subscribe((otherResult) => {
        actual = otherResult;
      });

      // Assert
      expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(actual).toBe(expected);
    });

    it('getCurrentPosition ERROR returns GeolocationPosition object', () => {

      const expected = <GeolocationPositionError>{
        code: 1,
        message: 'GeoLocation Error Message'
      };

      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((...args: any[]) => {
        args[1](expected);
      });

      let actual: any | undefined;

      service.getCurrentPosition()
        .subscribe({
          next: (position) => { },
          error: (error) => {
            actual = error
          },
        });

      // Assert
      expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(window.navigator.geolocation.getCurrentPosition).toThrowError()
      expect(actual).toEqual(expected.message);
    });
  });
});