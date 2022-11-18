import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HomeComponent } from 'src/app/_home/home/home.component';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { AuthenticationService } from '../authentication.service';
import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let fakeAuthService: jasmine.SpyObj<AuthenticationService>;
  let fakeNavService: NavigationService;

  fakeNavService = jasmine.createSpyObj<NavigationService>(
    'NavigationService',
    {
      back: undefined
    }
  );

  fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
    'AuthenticationService',
    {
      checkAuthStatus: undefined,
      logout: undefined,
    },
    {
      isAuthorisedObservable: of(false),
      getAuthUser: undefined,
    }
  );

  const setup = async () => {

    await TestBed.configureTestingModule({
      declarations: [
        LogoutComponent
      ],
      imports: [RouterTestingModule.withRoutes([
        { path: 'home', component: HomeComponent }
      ])],
      providers: [
        { provide: NavigationService, useValue: fakeNavService },
        { provide: AuthenticationService, useValue: fakeAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', fakeAsync(async () => {
    await setup();
    expect(component).toBeTruthy();
  }));


  it('signs out', fakeAsync(async () => {
    await setup();

    fixture.debugElement.query(By.css('.btn-confirm')).triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(fakeAuthService.logout).toHaveBeenCalled();
  }));

  it('does not sign out', fakeAsync(async () => {
    await setup();

    fixture.debugElement.query(By.css('.btn-cancel')).triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(fakeNavService.back).toHaveBeenCalled();
    
  }));

});
