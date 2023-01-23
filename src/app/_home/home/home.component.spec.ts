import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TokenService } from 'src/app/_auth/token.service';
import { ObservationFeedComponent } from 'src/app/_observation-feed/observation-feed/observation-feed.component';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  let fakeTokenService: jasmine.SpyObj<TokenService>;


  const setup = async (
    fakeTokenServiceReturnValues?: jasmine.SpyObjMethodNames<TokenService>) => {

    fakeTokenService = jasmine.createSpyObj<TokenService>(
      'TokenService',
      {
        addToken: undefined,
        getToken: undefined,
        getUser: undefined,
        isTokenValid: undefined,
        removeToken: undefined,
        ...fakeTokenServiceReturnValues
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'feed-p/public', component: ObservationFeedComponent }
        ])],
      providers: [
        { provide: TokenService, useValue: fakeTokenService }]
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
        isTokenValid: false
      });
      expect(component).toBeTruthy();
    }));

  });

  describe('when token is valid', () => {

    it('should create', fakeAsync(async () => {
      await setup({
        isTokenValid: true
      });
      expect(component).toBeTruthy();
    }));

  });
});
