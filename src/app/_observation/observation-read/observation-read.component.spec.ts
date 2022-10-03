import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { userModel } from 'src/app/testing/auth-test-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationReadService } from '../observation-read.service';

import { ObservationReadComponent } from './observation-read.component';

describe('ObservationReadComponent', () => {
  let component: ObservationReadComponent;
  let fixture: ComponentFixture<ObservationReadComponent>;
  let fakeObservationReadService: jasmine.SpyObj<ObservationReadService>;
  let fakeAuthService: AuthenticationService;
  let fakeNavService: NavigationService;

  fakeNavService = jasmine.createSpyObj<NavigationService>(
    'NavigationService',
    {
      back: undefined
    }
  );

  const setup = async (
    fakeMethodValues?: jasmine.SpyObjMethodNames<ObservationReadService>,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<ObservationReadService>,
    fakeRouteArgument?: string,
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>) => {

    fakeObservationReadService = jasmine.createSpyObj<ObservationReadService>(
      'ObservationReadService',
      {
        getData: undefined,
        ...fakeMethodValues
      },
      {
        isError: of(false),
        observation: of(null),
        ...fakePropertyValues
      }
    );

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined
      },
      {
        isAuthorisedObservable: of(false),
        isAuthorised: false,
        getAuthUser: of(userModel),
        ...fakeAuthPropertyValues
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        ObservationReadComponent
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(new Map(Object.entries({
            id: fakeRouteArgument
          })))
          // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
          // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
        }
      },
      { provide: AuthenticationService, useValue: fakeAuthService },
      { provide: NavigationService, useValue: fakeNavService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ObservationReadComponent,
      {
        set: {
          providers: [{ provide: ObservationReadService, useValue: fakeObservationReadService }]
        }
      }).compileComponents();

    fixture = TestBed.createComponent(ObservationReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('when component is created', () => {

    it('should be created and show the loading placeloader', fakeAsync(async () => {
      await setup({}, {}, '10', {});

      expect(component).toBeTruthy();
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    }));

    it('should be created and show the loading placeloader', fakeAsync(async () => {
      await setup({}, {}, '10', {});

      expect(component).toBeTruthy();
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    }));

    it('should get the id from the route and call data fetch', fakeAsync(async () => {
      const expectedRouteArgument = '10';

      await setup({}, {}, expectedRouteArgument, {});

      expect(fakeObservationReadService.getData).toHaveBeenCalledOnceWith(expectedRouteArgument);
    }));

    it('should redirect when route argument is null', fakeAsync(async () => {
      const expectedRouteArgument = '';

      await setup({}, {}, expectedRouteArgument, {});

      expect(fakeObservationReadService.getData).not.toHaveBeenCalled();
      expect(fakeNavService.back).toHaveBeenCalled();
    }));
  });




  
});
