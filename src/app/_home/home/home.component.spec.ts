import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { of } from 'rxjs';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let fakeService: jasmine.SpyObj<AuthenticationService>;
  let routerStub: any;

  const setup = async (
    fakeServiceReturnValues?: jasmine.SpyObjMethodNames<AuthenticationService>) => {

    // fakeTokenService = jasmine.createSpyObj<TokenService>(
    //   'TokenService',
    //   {
    //     addToken: undefined,
    //     getToken: undefined,
    //     getUser: undefined,
    //     isTokenValid: undefined,
    //     removeToken: undefined,
    //     ...fakeTokenServiceReturnValues
    //   }
    // );

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

    routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
    imports: [HomeComponent],
    providers: [
        { provide: AuthenticationService, useValue: fakeService },
        { provide: Router, useValue: routerStub }
    ]
}).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
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
        // isTokenValid: false
      });

      expect(routerStub.navigate).not.toHaveBeenCalledWith(['/feed-p/public']);
    }));

  });

  describe('when token is valid', () => {

    it('should redirect to the ObservationFeed', fakeAsync(async () => {
      await setup({
        isLoggedIn: true
      });

      expect(routerStub.navigate).toHaveBeenCalledWith(['/feed-p/public']);
    }));
  });
});