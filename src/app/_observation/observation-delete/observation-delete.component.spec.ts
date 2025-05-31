import {
  NO_ERRORS_SCHEMA,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationCrudService } from '../observation-crud.service';
import { ObservationReadService } from '../observation-read.service';

import { ObservationDeleteComponent } from './observation-delete.component';

describe('ObservationDeleteComponent', () => {
  let component: ObservationDeleteComponent;
  let fixture: ComponentFixture<ObservationDeleteComponent>;
  let fakeObservationReadService: jasmine.SpyObj<ObservationReadService>;
  let fakeAuthService: AuthenticationService;
  let fakeNavService: NavigationService;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;
  let fakeObservationCrudService: jasmine.SpyObj<ObservationCrudService>;

  fakeNavService = jasmine.createSpyObj<NavigationService>(
    'NavigationService',
    {
      back: undefined,
    }
  );

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<ObservationReadService>,
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>,
    fakeRouteArgument?: string
  ) => {
    fakeObservationReadService = jasmine.createSpyObj<ObservationReadService>(
      'ObservationReadService',
      {
        getData: undefined,
      },
      {
        isError: of(false),
        observation: of(null),
        ...fakePropertyValues,
      }
    );

    fakeObservationCrudService = jasmine.createSpyObj<ObservationCrudService>(
      'ObservationCrudService',
      {
        getObservation: undefined,
        updateObservation: undefined,
        addObservation: undefined,
        deleteObservation: undefined,
      }
    );

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined,
      },
      {
        isAuthorisedObservable: undefined,
        getAuthUser: of(null),
        ...fakeAuthPropertyValues,
      }
    );

    fakeAnnounceChangesService = jasmine.createSpyObj<AnnounceChangesService>(
      'AnnounceChangesService',
      {
        announceNetworkChanged: undefined,
        announceObservationsChanged: undefined,
      }
    );

    await TestBed.configureTestingModule({
      imports: [ObservationDeleteComponent],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              new Map(
                Object.entries({
                  id: fakeRouteArgument,
                })
              )
            ),
            // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
            // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
          },
        },
        {
          provide: AnnounceChangesService,
          useValue: fakeAnnounceChangesService,
        },
        {
          provide: ObservationCrudService,
          useValue: fakeObservationCrudService,
        },
        { provide: AuthenticationService, useValue: fakeAuthService },
        { provide: NavigationService, useValue: fakeNavService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ObservationDeleteComponent, {
        set: {
          providers: [
            {
              provide: ObservationReadService,
              useValue: fakeObservationReadService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ObservationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('when component is created', () => {
    it('should be created and show the loading placeholder', async () => {
      await setup({}, {}, '');

      expect(component).toBeTruthy();
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    });

    it('should get the id from the route and call data fetch', async () => {
      const expectedRouteArgument = '10';

      await setup({}, {}, expectedRouteArgument);

      expect(fakeObservationReadService.getData).toHaveBeenCalledOnceWith(
        expectedRouteArgument
      );
    });

    it('should redirect when route argument is null/falsy', async () => {
      const expectedRouteArgument = '';

      await setup({}, {}, expectedRouteArgument);

      expect(fakeObservationReadService.getData).not.toHaveBeenCalled();
      expect(fakeNavService.back).toHaveBeenCalled();
    });
  });
});
