import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { provideRouter, Router, Routes } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { of } from 'rxjs';
import { ObservationFeedComponent } from 'src/app/_observation-feed/observation-feed/observation-feed.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { LoginComponent } from 'src/app/_auth/login/login.component';
import { AccountRegistrationComponent } from 'src/app/_account/account-registration/account-registration.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let loader: HarnessLoader;
  let fixture: ComponentFixture<HomeComponent>;
  let fakeService: jasmine.SpyObj<AuthenticationService>;
  let router: Router;

  const routes: Routes = [
    { path: 'feed-p/public', component: ObservationFeedComponent },
    { path: 'login', component: LoginComponent },
    { path: 'account/registration', component: AccountRegistrationComponent },
  ];

  const setup = async (
    fakeServiceReturnValues?: jasmine.SpyObjMethodNames<AuthenticationService>) => {

    fakeService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        isLoggedIn: undefined,
        checkAuthStatus: undefined,
        logout: undefined,
        ...fakeServiceReturnValues
      },
      {
        isAuthorisedObservable: of(false),
        getAuthUser: undefined
      }
    );

    await TestBed.configureTestingModule({
      imports: [HomeComponent, NoopAnimationsModule],
      providers: [
        provideRouter(routes),
        { provide: AuthenticationService, useValue: fakeService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  };


  it('should create', fakeAsync(async () => {
    await setup();
    expect(component).toBeTruthy();
  }));

  describe('when token is not valid', () => {

    it('should create', fakeAsync(async () => {
      await setup({
        isLoggedIn: false
      });

      expect(router.navigate).not.toHaveBeenCalledWith(['/feed-p/public']);
    }));

  });

  describe('when token is valid', () => {

    it('should redirect to the ObservationFeed', fakeAsync(async () => {
      await setup({
        isLoggedIn: true
      });

      expect(router.navigate).toHaveBeenCalledWith(['/feed-p/public']);
    }));
  });

  describe('', () => {

    it('should render the Login button', async () => {
      await setup({ isLoggedIn: false });

      const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#btn-login' }));
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toContain('I already have an account');
    });

    it('should render the Login button', async () => {
      await setup({ isLoggedIn: false });

      const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#btn-login-two' }));
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toContain('I already have an account');
    });

    it('should render the Register button', async () => {
      await setup({ isLoggedIn: false });

      const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#btn-register' }));
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toContain('Get started');
    });

    it('should render the Login button', async () => {
      await setup({ isLoggedIn: false });

      const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#btn-register-two' }));
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toContain('Get started');
    });


    // it('should open Login page', async () => {
    //   await setup({ isLoggedIn: false });

    //   // const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#btn-register' }));
    //   // await btn.click();

    //   fixture.debugElement.query(By.css('.button-poiu')).triggerEventHandler('click', null);
    //   // expect(routerStub.navigate).toHaveBeenCalledWith(['/home']
    //   expect(router.navigate).toHaveBeenCalledWith(['/home']);
    // });
  });
});


// https://dev.to/this-is-angular/testing-angular-routing-components-with-routertestingharness-providelocationmocks-and-providerouter-oi8


// import { Location } from '@angular/common';
// import { provideLocationMocks } from '@angular/common/testing';
// import { Location } from '@angular/common';
// import { provideLocationMocks } from '@angular/common/testing';
// import { Component } from '@angular/core';
// import {
//   fakeAsync,
//   TestBed,
//   tick,
// } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { RouterTestingHarness } from '@angular/router/testing';
// import { asapScheduler, of } from 'rxjs';
// import { observeOn } from 'rxjs/operators';

// import { HeroService } from '../hero.service';
// import { HEROES } from '../mock-heroes';
// import { DashboardComponent } from './dashboard.component';

// async function setup() {
//   const fakeService = jasmine.createSpyObj<AuthenticationService>(
//     'AuthenticationService',
//     {
//       isLoggedIn: undefined,
//       checkAuthStatus: undefined,
//       logout: undefined,
//     },
//     {
//       isAuthorisedObservable: of(false),
//       getAuthUser: undefined
//     }
//   );

//   TestBed.configureTestingModule({
//     providers: [
//       provideRouter([
//         { path: 'feed-p/public', component: ObservationFeedComponent },
//         { path: 'login', component: LoginComponent },
//         { path: 'account/registration', component: AccountRegistrationComponent },
//       ]),
//       provideLocationMocks(),
//       { provide: AuthenticationService, useValue: fakeService },
//     ],
//   });

//   const harness = await RouterTestingHarness.create(); // [1]
//   const location = TestBed.inject(Location);

//   return {
//     advance() {
//       tick();
//       harness.detectChanges();
//     },
//     clickTopHero() {
//       const firstHeroLink = harness.routeDebugElement?.query(
//         By.css('.button-poiu')
//       );

//       firstHeroLink?.triggerEventHandler('click', {
//         button: leftMouseButton,
//       });
//     },
//     harness,
//     location,
//   };
// }

// @Component({
//   standalone: true,
//   template: '',
// })
// class TestHeroDetailComponent { }

// const leftMouseButton = 0;

// describe('DashboardComponent (integrated)', () => {
//   it('navigates to the detail view when a hero link is clicked', fakeAsync(async () => {
//     const { advance, clickTopHero, harness, location } =
//       await setup();
//     const component /* [2] */ = await harness.navigateByUrl(
//       '/account/registration',
//       AccountRegistrationComponent // [3]
//     );
//     // const [topHero] = component.heroes;

//     clickTopHero();
//     advance();

//     const expectedPath = '/account/registration';
//     expect(location.path())
//       .withContext(
//         'must navigate to the detail view for the top hero'
//       )
//       .toBe(expectedPath);
//   }));
// });