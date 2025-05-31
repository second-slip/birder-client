import {
  NO_ERRORS_SCHEMA,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  ComponentFixture,
  DeferBlockBehavior,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { userModel } from 'src/app/testing/auth-test-helpers';
import {
  expectText,
  expectTextToContain,
  findComponent,
} from 'src/app/testing/element.spec-helper';
import {
  singleObservationView,
  singleObservationViewAuthUser,
} from 'src/app/testing/observation-test-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationReadService } from '../observation-read.service';
import { ObservationReadComponent } from './observation-read.component';
import { ReadOnlyMapComponent } from 'src/app/_map/read-only-map/read-only-map.component';
import { ViewOnlyNotesComponent } from 'src/app/_observation-note/view-notes/view-only-notes.component';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';
import { MockComponent } from 'ng-mocks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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

    await TestBed.configureTestingModule({
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
      imports: [ObservationReadComponent, NoopAnimationsModule],
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
        { provide: AuthenticationService, useValue: fakeAuthService },
        { provide: NavigationService, useValue: fakeNavService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ObservationReadComponent, {
        remove: {
          imports: [
            ReadOnlyMapComponent,
            ViewOnlyNotesComponent,
            NavigationMenuComponent,
          ],
          providers: [ObservationReadService],
        },
        add: {
          imports: [
            MockComponent(ReadOnlyMapComponent),
            MockComponent(ViewOnlyNotesComponent),
            MockComponent(NavigationMenuComponent),
          ],
          providers: [
            {
              provide: ObservationReadService,
              useValue: fakeObservationReadService,
            },
          ],
        },
        // set: {
        //   providers: [{ provide: ObservationReadService, useValue: fakeObservationReadService }]
        // }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ObservationReadComponent);
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

    it('should redirect when route argument is null', async () => {
      const expectedRouteArgument = '';

      await setup({}, {}, expectedRouteArgument);

      expect(fakeObservationReadService.getData).not.toHaveBeenCalled();
      expect(fakeNavService.back).toHaveBeenCalled();
    });
  });

  describe('successful data fetch', () => {
    it('calls data fetch', async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView),
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );
      expect(fakeObservationReadService.getData).toHaveBeenCalledOnceWith('10');
    });

    it('shows the child components', async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView),
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );

      await fixture.whenStable();

      // const { debugElement } = fixture;
      // const map = debugElement.query(By.css('app-read-only-map'));
      // expect(map).toBeTruthy();

      // const map = findComponent(fixture, 'app-read-only-map');
      // expect(map).toBeTruthy();

      const menu = findComponent(fixture, 'app-navigation-menu');
      expect(menu).toBeTruthy();
    });

    it('renders the correct title when is NOT the record owner', async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView),
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );

      const expectedTitle = ` ${singleObservationView.username}  observed ${singleObservationView.quantity}  ${singleObservationView.englishName}  ${singleObservationView.species}  on `;

      expectTextToContain(fixture, 'observation-title', expectedTitle);
    });

    it('renders the correct title when is the record owner', async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationViewAuthUser),
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );

      const p = ` You  observed ${singleObservationView.quantity}  ${singleObservationView.englishName}  ${singleObservationView.species}  on `;

      expectTextToContain(fixture, 'observation-title', p);
    });

    it('does not show error section', async () => {
      await setup(
        {
          isError: of(false),
          observation: of(singleObservationView),
        },
        {
          getAuthUser: of(userModel),
        },
        '10'
      );
      const error = fixture.nativeElement as HTMLElement;
      expect(
        error.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });

    // it('does not show loading section', async () => {
    //   await setup(
    //     {
    //       isError: of(false),
    //       observation: of(singleObservationView)
    //     },
    //     {
    //       getAuthUser: of(userModel),
    //     },
    //     '10'
    //   );

    //   // tick(10000);
    //   // fixture.detectChanges()
    //   await fixture.whenStable();

    //   const compiled = fixture.nativeElement as HTMLElement;
    //   // expect(compiled.querySelector('[data-testid="main-title"]')?.textContent).toContain('Website Features');
    //   // expect(compiled.querySelector('[data-testid="loading"]')?.textContent).toBeUndefined();

    //   expect(fixture.nativeElement.innerHTML).not.toContain('loading...');

    //   const map = findComponent(fixture, 'app-read-only-map');
    //   expect(map).toBeTruthy();

    //   const { debugElement } = fixture;
    //   const loading = debugElement.query(By.css('app-loading'));
    //   expect(loading).toBeNull();
    // });

    describe('when error fetching data', () => {
      it('shows error content', async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null),
          },
          {
            getAuthUser: of(userModel),
          },
          '10'
        );

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="error"]')?.textContent
        ).toBeDefined();
        expect(
          compiled.querySelector('[data-testid="reload-button"]')?.textContent
        ).toBeDefined();
        expectText(
          fixture,
          'error',
          'Whoops! There was an error retrieving the data.Try Again'
        );
      });

      it('tries data fetch again on user button click', async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null),
          },
          {
            getAuthUser: of(userModel),
          },
          '10'
        );

        fixture.debugElement
          .query(By.css('.btn-try-again'))
          .triggerEventHandler('click', null);

        expect(fakeObservationReadService.getData).toHaveBeenCalledWith('10');
      });

      it('redirects on retry if id is null or empty', async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null),
          },
          {
            getAuthUser: of(userModel),
          },
          ''
        );

        fixture.debugElement
          .query(By.css('.btn-try-again'))
          .triggerEventHandler('click', null);

        expect(fakeObservationReadService.getData).not.toHaveBeenCalled();
        expect(fakeNavService.back).toHaveBeenCalled();
      });

      it('hides main content', async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null),
          },
          {
            getAuthUser: of(userModel),
          },
          '10'
        );

        const title = fixture.nativeElement as HTMLElement;
        expect(
          title.querySelector('[data-testid="observationtiitle"]')?.textContent
        ).toBeUndefined();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(
          compiled.querySelector('[data-testid="observation"]')?.textContent
        ).toBeUndefined();
      });

      it('does not show loading section', async () => {
        await setup(
          {
            isError: of(true),
            observation: of(null),
          },
          {
            getAuthUser: of(userModel),
          },
          '10'
        );

        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeNull();
      });
    });
  });
});
