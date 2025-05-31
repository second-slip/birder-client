import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { IAuthUser } from 'src/app/_auth/i-auth-user.dto';
import { of } from 'rxjs';
import { FilterControlComponent } from './filter-control.component';
import { provideRouter } from '@angular/router';
import { blankRoutesArray } from 'src/app/testing/route-tests-helpers';
import { provideZonelessChangeDetection } from '@angular/core';

// ToDo: Test the template

describe('FilterControlComponent', () => {
  let component: FilterControlComponent;
  let fixture: ComponentFixture<FilterControlComponent>;

  let fakeAuthService: AuthenticationService;

  const authUser: IAuthUser = {
    userName: 'test',
    avatar: 'testAvatar',
    defaultLocationLatitude: 0.99,
    defaultLocationLongitude: 0.88,
  };

  fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
    'AuthenticationService',
    {
      checkAuthStatus: undefined,
      logout: undefined,
    },
    {
      isAuthorisedObservable: of(false),
      getAuthUser: of(authUser),
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterControlComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthenticationService, useValue: fakeAuthService },
        provideRouter(blankRoutesArray),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
