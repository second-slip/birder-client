import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { IAuthUser } from 'src/app/_auth/i-auth-user.dto';
import { of } from 'rxjs';

import { FilterControlComponent } from './filter-control.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// ToDo: Test the template

describe('FilterControlComponent', () => {
  let component: FilterControlComponent;
  let fixture: ComponentFixture<FilterControlComponent>;

  let fakeAuthService: AuthenticationService;

  const authUser: IAuthUser = {
      userName: 'test',
      avatar: 'testAvatar',
      defaultLocationLatitude: 0.99,
      defaultLocationLongitude: 0.88
  }

  fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
          checkAuthStatus: undefined,
          logout: undefined
      },
      {
          isAuthorisedObservable: of(false),
          getAuthUser: of(authUser)
      }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbDropdownModule, FilterControlComponent],
    providers: [{ provide: AuthenticationService, useValue: fakeAuthService }]
})
    .compileComponents();
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
