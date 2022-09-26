import { fakeAsync, TestBed } from '@angular/core/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let fakeJwtService: jasmine.SpyObj<JwtHelperService>;
  
  const setup = async (fakeJwtServiceReturnValues?: jasmine.SpyObjMethodNames<JwtHelperService>) => {

    fakeJwtService = jasmine.createSpyObj<JwtHelperService>(
      'JwtHelperService',
      {
          decodeToken: undefined,
          getAuthScheme: undefined,
          getTokenExpirationDate: undefined,
          isTokenExpired: undefined,
          tokenGetter:undefined,
          urlBase64Decode: undefined,
        ...fakeJwtServiceReturnValues
      }
    );

    await TestBed.configureTestingModule({
      providers: [{ provide: JwtHelperService, useValue: fakeJwtService }]
    })
    service = TestBed.inject(TokenService);
  };

  it('should be created', fakeAsync(async() => {
    await setup();
    expect(service).toBeTruthy();
  }));
});