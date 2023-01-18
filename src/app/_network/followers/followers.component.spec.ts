import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { userModel } from 'src/app/testing/auth-test-helpers';
import { expectText, findComponent } from 'src/app/testing/element.spec-helper';
import { fakeNetworkUserModelArray } from 'src/app/testing/network-test-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';

import { FollowersComponent } from './followers.component';
import { FollowersService } from './followers.service';

describe('FollowersComponent', () => {
  let component: FollowersComponent;
  let fixture: ComponentFixture<FollowersComponent>;
  let fakeService: jasmine.SpyObj<FollowersService>;
  let fakeAuthService: jasmine.SpyObj<AuthenticationService>;

  const setup = async (
    fakeMethodValues?: jasmine.SpyObjMethodNames<FollowersService>,
    fakePropertyValues?: jasmine.SpyObjPropertyNames<FollowersService>,
    fakeRouteArgument?: string) => {

    fakeService = jasmine.createSpyObj<FollowersService>(
      'FollowersService',
      {
        getData: undefined,
        ...fakeMethodValues
      },
      {
        isError: of(false),
        getFollowers: of(null),
        ...fakePropertyValues
      }
    );

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined,
        // ...fakeAuthReturnValues
      },
      {
        isAuthorisedObservable: of(true),
        getAuthUser: of(userModel),
        //...fakeAuthPropertyValues
      },
    )

    await TestBed.configureTestingModule({
      declarations: [
        FollowersComponent
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(new Map(Object.entries({
            username: fakeRouteArgument
          })))
          // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
          // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
        }
      }],
      imports: [NgbNavModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(FollowersComponent,
      {
        set: {
          providers: [
            { provide: FollowersService, useValue: fakeService },
            { provide: AuthenticationService, useValue: fakeAuthService }
          ]
        }
      }).compileComponents();

    fixture = TestBed.createComponent(FollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };


  //TEST AUTH SECTION
  // SUPPLY ROUTE ARGUMENT AND CHECK IT IS IN THE TEMPLATE



  it('"SMOKE TEST": should be created and show the loading placeloader', fakeAsync(async () => {
    await setup({}, {});

    expect(component).toBeTruthy();
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-loading'));
    expect(loading).toBeTruthy();
  }));


  describe('when response is successful', () => {

    it('calls data fetch service method', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowers: of(fakeNetworkUserModelArray)
        },
        'test-username');

      expect(fakeService.getData).toHaveBeenCalledTimes(1);
      expect(fakeService.getData).toHaveBeenCalledOnceWith('test-username');
    }));

    it('shows the followers list when followers > 0', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowers: of(fakeNetworkUserModelArray)
        },
        'test-username');

      const feedItems = findComponent(fixture, 'app-network-user');
      expect(feedItems).toBeTruthy();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="followers-list"]')?.textContent).toBeDefined();
      expect(compiled.querySelector('[data-testid="followers-list-is-zero"]')?.textContent).toBeUndefined();
    }));

    it('shows the no followers content when followers = 0 ([])', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowers: of([])
        },
        'test-username');

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="followers-list"]')?.textContent).toBeUndefined();
      expect(compiled.querySelector('[data-testid="followers-list-is-zero"]')?.textContent).toBeDefined();
    }));

    it('does not show error section', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowers: of(fakeNetworkUserModelArray)
        },
        'test-username');

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup({},
        {
          isError: of(false),
          getFollowers: of(fakeNetworkUserModelArray)
        },
        'test-username');

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));


    describe('when response is unsuccessful', () => {

      it('shows error content', fakeAsync(async () => {
        await setup({},
          {
            isError: of(true),
            getFollowers: of(null)
          },
          'test-username');

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
        expect(compiled.querySelector('[data-testid="reload-button"]')?.textContent).toBeDefined();
        expectText(fixture, 'error', 'Whoops! There was an error retrieving the data.Try Again');
      }));

      it('tries data fetch again on retry button click', fakeAsync(async () => {
        await setup({},
          {
            isError: of(true),
            getFollowers: of(null)
          },
          'test-username');

        fixture.debugElement.query(By.css('.btn-try-again')).triggerEventHandler('click', null);

        expect(fakeService.getData).toHaveBeenCalledWith('test-username');
      }));

      it('does not show success content', fakeAsync(async () => {
        await setup({},
          {
            isError: of(true),
            getFollowers: of(null)
          },
          'test-username');

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="followers-list"]')?.textContent).toBeUndefined();
        expect(compiled.querySelector('[data-testid="followers-list-is-zero"]')?.textContent).toBeUndefined();

      }));

      it('does not show loading section', fakeAsync(async () => {
        await setup({},
          {
            isError: of(true),
            getFollowers: of(null)
          },
          'test-username');

        const { debugElement } = fixture;
        const loading = debugElement.query(By.css('app-loading'));
        expect(loading).toBeNull();
      }));


    });

    describe('Header section', () => {

      it('shows the correct title variant when user views other users followers', fakeAsync(async () => {
        await setup({},
          {
            isError: of(false),
            getFollowers: of(fakeNetworkUserModelArray)
          },
          'test-username');

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="title"]')?.textContent).toBeDefined();
        expectText(fixture, 'title', "test-username's followers");
        expect(compiled.querySelector('[data-testid="nav-menu"]')?.textContent).toBeDefined();
      }));

      it('shows the correct title variant when user views other users followers', fakeAsync(async () => {
        await setup({},
          {
            isError: of(false),
            getFollowers: of(fakeNetworkUserModelArray)
          },
          'AuthUser'); // <-- username used in userModel

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="title"]')?.textContent).toBeDefined();
        expectText(fixture, 'title', "Your followers");
        expect(compiled.querySelector('[data-testid="nav-menu"]')?.textContent).toBeDefined();
      }));



    });

  })
});