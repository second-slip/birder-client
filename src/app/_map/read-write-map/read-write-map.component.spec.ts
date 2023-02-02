import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { GoogleMapsModule } from '@angular/google-maps';
import { of } from 'rxjs';
import { googleMapsApiResponse } from 'src/app/testing/map-tests-helpers';
import { GeocodeService } from '../geocode.service';

import { ReadWriteMapComponent } from './read-write-map.component';


describe('ReadWriteMapComponent', () => {
  let component: ReadWriteMapComponent;
  let fixture: ComponentFixture<ReadWriteMapComponent>;
  let fakeService: jasmine.SpyObj<GeocodeService>;

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

    component.latitude = 0.6;
    component.longitude = 0.4;


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.markerStatus).toBe('success');

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