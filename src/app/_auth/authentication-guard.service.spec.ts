import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationGuardService } from './authentication-guard.service';
import { AuthenticationService } from './authentication.service';
import { LoginComponent } from './login/login.component';

describe('AuthenticationGuardService', () => {
  let service: AuthenticationGuardService;
  let fakeAuthService: jasmine.SpyObj<AuthenticationService>;

  const setup = async (
    fakeAuthReturnValues?: jasmine.SpyObjMethodNames<AuthenticationService>,
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>) => {

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined,
        ...fakeAuthReturnValues
      },
      {
        isAuthorisedObservable: undefined,
        isAuthorised: undefined,
        getAuthUser: undefined,
        ...fakeAuthPropertyValues
      },
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'login', component: LoginComponent }])
      ],
      providers: [AuthenticationGuardService, { provide: AuthenticationService, useValue: fakeAuthService }]
    })
    service = TestBed.inject(AuthenticationGuardService);
  };

  it('should be created', fakeAsync(async () => {
    await setup();
    expect(service).toBeTruthy();
    service.ngOnInit();
    expect(fakeAuthService.checkAuthStatus).toHaveBeenCalled();
  }));


    it('cannot activate routes when not authenticated', fakeAsync(async () => {

      await setup(
        {},
        {
          isAuthorised: false
        });

        const canActivate = service.canActivate();
        const canActivateChild = service.canActivateChild();

        expect(canActivate).toBeFalse();
        expect(canActivateChild).toBeFalse();

        expect(fakeAuthService.checkAuthStatus).toHaveBeenCalled();
    }));

    it('can activate routes when authenticated', fakeAsync(async () => {

      await setup(
        {},
        {
          isAuthorised: true
        });

        const canActivate = service.canActivate();
        const canActivateChild = service.canActivateChild();

        expect(canActivate).toBeTrue();
        expect(canActivateChild).toBeTrue();

        expect(fakeAuthService.checkAuthStatus).toHaveBeenCalled();
    }));
});
