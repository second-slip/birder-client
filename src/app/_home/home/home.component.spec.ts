import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let mockAuthenticationService;

  let isAuthenticated: Boolean;

  beforeEach(async(() => {
    mockAuthenticationService = jasmine.createSpyObj(['checkIsAuthenticatedObservable']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          // { path: 'login', component: DummyLoginLayoutComponent },
        ])
      ],
      declarations: [ HomeComponent ],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    // mockAuthenticationService.checkIsAuthenticatedObservable.and.returnValue(of(isAuthenticated));
    // fixture.detectChanges();
  });

  it('should create', () => {
    // isAuthenticated = true;
    // fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
