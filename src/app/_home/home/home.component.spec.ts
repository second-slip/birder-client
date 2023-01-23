import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/_auth/token.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let fakeTokenService: jasmine.SpyObj<TokenService>;
  let routerStub: any;

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

    routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      providers: [
        { provide: TokenService, useValue: fakeTokenService },
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
        isTokenValid: false
      });

      expect(routerStub.navigate).not.toHaveBeenCalledWith(['/feed-p/public']);
    }));

  });

  describe('when token is valid', () => {

    it('should redirect to the ObservationFeed', fakeAsync(async () => {
      await setup({
        isTokenValid: true
      });

      expect(routerStub.navigate).toHaveBeenCalledWith(['/feed-p/public']);
    }));
  });
});