import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Routes } from '@angular/router';
import { of } from 'rxjs';
import { singleObservationAuthUser } from 'src/app/testing/observation-test-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationCrudService } from '../observation-crud.service';
import { ObservationReadComponent } from '../observation-read/observation-read.component';

import { ObservationUpdateComponent } from './observation-update.component';

describe('ObservationUpdateComponent', () => {
  let component: ObservationUpdateComponent;
  let fixture: ComponentFixture<ObservationUpdateComponent>;

  // let fakeObservationReadService: jasmine.SpyObj<ObservationCreateComponent>;
  let fakeAuthService: AuthenticationService;
  let fakeNavService: NavigationService;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;

  let fakeObservationCrudService: jasmine.SpyObj<ObservationCrudService>;

  fakeNavService = jasmine.createSpyObj<NavigationService>(
    'NavigationService',
    {
      back: undefined
    }
  );

  const routes: Routes = [
    { path: 'login', component: ObservationReadComponent }
  ];

  const setup = async (
    fakeCrudMethodValues?: jasmine.SpyObjMethodNames<ObservationCrudService>,
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>,
    fakeRouteArgument?: string) => {


    fakeObservationCrudService = jasmine.createSpyObj<ObservationCrudService>(
      'ObservationCrudService',
      {
        getObservation: undefined,
        updateObservation: undefined,
        addObservation: undefined,
        deleteObservation: undefined,
        ...fakeCrudMethodValues
      });

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined
      },
      {
        isAuthorisedObservable: undefined,
        getAuthUser: of(null),
        ...fakeAuthPropertyValues
      }
    );

    fakeAnnounceChangesService = jasmine.createSpyObj<AnnounceChangesService>(
      'AnnounceChangesService',
      {
        announceNetworkChanged: undefined,
        announceObservationsChanged: undefined
      });

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ObservationUpdateComponent],
      providers: [
        provideRouter(routes),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map(Object.entries({
              id: fakeRouteArgument
            })))
            // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
            // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
          }
        },
        { provide: AnnounceChangesService, useValue: fakeAnnounceChangesService },
        { provide: ObservationCrudService, useValue: fakeObservationCrudService },
        { provide: NavigationService, useValue: fakeNavService },
        { provide: AuthenticationService, useValue: fakeAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };


  describe('when component is created', () => {

    it('should be created and show the loading placeloader', fakeAsync(async () => {
      await setup({}, {}, '');

      expect(component).toBeTruthy();
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    }));

    it('should get the id from the route and call data fetch', fakeAsync(async () => {
      const expectedRouteArgument = '10';

      await setup({
        getObservation: of(singleObservationAuthUser)
      }, {}, expectedRouteArgument);

      expect(fakeObservationCrudService.getObservation).toHaveBeenCalledOnceWith(expectedRouteArgument);
    }));

    it('should redirect when route argument is null', fakeAsync(async () => {
      const expectedRouteArgument = '';

      await setup({}, {}, expectedRouteArgument);

      expect(fakeObservationCrudService.getObservation).not.toHaveBeenCalled();
      expect(fakeNavService.back).toHaveBeenCalled();
    }));

    // observation fetch error should redirect


  });


});
