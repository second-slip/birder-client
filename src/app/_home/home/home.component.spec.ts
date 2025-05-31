import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { provideZonelessChangeDetection } from '@angular/core';

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
    fakeServiceReturnValues?: jasmine.SpyObjMethodNames<AuthenticationService>
  ) => {
    fakeService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        isLoggedIn: undefined,
        checkAuthStatus: undefined,
        logout: undefined,
        ...fakeServiceReturnValues,
      },
      {
        isAuthorisedObservable: of(false),
        getAuthUser: undefined,
      }
    );

    await TestBed.configureTestingModule({
      imports: [HomeComponent, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        { provide: AuthenticationService, useValue: fakeService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  };

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  describe('when token is not valid', () => {
    it('should create', async () => {
      await setup({
        isLoggedIn: false,
      });

      expect(router.navigate).not.toHaveBeenCalledWith(['/feed-p/public']);
    });
  });

  describe('when token is valid', () => {
    it('should redirect to the ObservationFeed', async () => {
      await setup({
        isLoggedIn: true,
      });

      expect(router.navigate).toHaveBeenCalledWith(['/feed-p/public']);
    });
  });

  describe('', () => {
    it('should render the Login button', async () => {
      await setup({ isLoggedIn: false });

      const btn = await loader.getHarness(
        MatButtonHarness.with({ selector: '#btn-login' })
      );
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toContain('I already have an account');
    });

    it('should render the Login button', async () => {
      await setup({ isLoggedIn: false });

      const btn = await loader.getHarness(
        MatButtonHarness.with({ selector: '#btn-login-two' })
      );
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toContain('I already have an account');
    });

    it('should render the Register button', async () => {
      await setup({ isLoggedIn: false });

      const btn = await loader.getHarness(
        MatButtonHarness.with({ selector: '#btn-register' })
      );
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toContain('Get started');
    });

    it('should render the Login button', async () => {
      await setup({ isLoggedIn: false });

      const btn = await loader.getHarness(
        MatButtonHarness.with({ selector: '#btn-register-two' })
      );
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
