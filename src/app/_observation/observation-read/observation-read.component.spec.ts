import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { userModel } from 'src/app/testing/auth-test-helpers';
import { expectText, expectTextToContain, findComponent } from 'src/app/testing/element.spec-helper';
import { singleObservationView, singleObservationViewAuthUser } from 'src/app/testing/observation-test-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationReadService } from '../observation-read.service';

import { ObservationReadComponent } from './observation-read.component';

// todo: test different tab contents....

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
    fakePropertyValues?: jasmine.SpyObjPropertyNames<ObservationReadService>,
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>,
    fakeRouteArgument?: string) => {

    fakeObservationReadService = jasmine.createSpyObj<ObservationReadService>(
      'ObservationReadService',
      {
        getData: undefined
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
        isAuthorisedObservable: undefined,
        getAuthUser: of(null),
        ...fakeAuthPropertyValues
      }
    );

    await TestBed.configureTestingModule({
      imports: [NgbNavModule],
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
      await setup({}, {}, '');

      expect(component).toBeTruthy();
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    }));

    it('should get the id from the route and call data fetch', fakeAsync(async () => {
      const expectedRouteArgument = '10';

      await setup({}, {}, expectedRouteArgument);

      expect(fakeObservationReadService.getData).toHaveBeenCalledOnceWith(expectedRouteArgument);
    }));

    it('should redirect when route argument is null', fakeAsync(async () => {
      const expectedRouteArgument = '';

      await setup({}, {}, expectedRouteArgument);

      expect(fakeObservationReadService.getData).not.toHaveBeenCalled();
      expect(fakeNavService.back).toHaveBeenCalled();
    }));
  });



  describe('successful data fetch', () => {

    it('calls data fetch', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView)
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );
      expect(fakeObservationReadService.getData).toHaveBeenCalledOnceWith('10');
    }));

    it('shows the observation', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView)
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );

      const map = findComponent(fixture, 'app-read-only-map');
      expect(map).toBeTruthy();

      const menu = findComponent(fixture, 'app-navigation-menu');
      expect(menu).toBeTruthy();
    }));

    it('renders the correct title when is NOT the record owner', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView)
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );

      const expectedTitle = ` ${singleObservationView.username}  observed ${singleObservationView.quantity}  ${singleObservationView.englishName}  ${singleObservationView.species}  on `

      expectTextToContain(fixture, 'observation-title', expectedTitle);
    }));

    it('renders the correct title when is the record owner', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationViewAuthUser)
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );

      const p = ` You  observed ${singleObservationView.quantity}  ${singleObservationView.englishName}  ${singleObservationView.species}  on `

      expectTextToContain(fixture, 'observation-title', p);
    }));

    it('does not show error section', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView)
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );
      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView)
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));


    describe('when error fetching data', () => {

      it('shows error content', fakeAsync(async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null)
          },
          {
            getAuthUser: of(userModel),
          },
          '10'
        );

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
        expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
        expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
      }));

      it('tries data fetch again on user button click', fakeAsync(async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null)
          },
          {
            getAuthUser: of(userModel),
          },
          '10'
        );

        fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

        expect(fakeObservationReadService.getData).toHaveBeenCalledWith('10');
      }));

      it('redirects on retry if id is null or empty', fakeAsync(async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null)
          },
          {
            getAuthUser: of(userModel),
          },
          ''
        );

        fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

        expect(fakeObservationReadService.getData).not.toHaveBeenCalled();
        expect(fakeNavService.back).toHaveBeenCalled();
      }));

      it('hides main content', fakeAsync(async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null)
          },
          {
            getAuthUser: of(userModel),
          },
          '10'
        );

        const title = fixture.nativeElement as HTMLElement;
        expect(title.querySelector('[data-testid="observationtiitle"]')?.textContent).toBeUndefined();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="observation"]')?.textContent).toBeUndefined();
      }));

      it('does not show loading section', fakeAsync(async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null)
          },
          {
            getAuthUser: of(userModel),
          },
          '10'
        );

        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeNull();
      }));

    });





  });







});
