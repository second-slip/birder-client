import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router, Routes } from '@angular/router';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ObservationFeedComponent } from 'src/app/_observation-feed/observation-feed/observation-feed.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let fakeService: jasmine.SpyObj<AuthenticationService>;
  let router: Router;

  const routes: Routes = [
    { path: 'feed-p/public', component: ObservationFeedComponent }
  ];

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

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: AuthenticationService, useValue: fakeService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

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
});