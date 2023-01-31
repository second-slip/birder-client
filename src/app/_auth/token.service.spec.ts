import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService]
    });
    service = TestBed.inject(TokenService);
  });

  beforeEach(() => {
    let store: any = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  });


  it('SMOKE TEST - should create the service', 
    () => {
    expect(service).toBeTruthy();
  });

  describe('setToken', () => {
    it('should store the token in localStorage',
      () => {
        service.addToken('sometoken');
        expect(localStorage.getItem('jwt')).toEqual('sometoken');
    });
  });

  describe('getToken', () => {
    it('should return stored token from localStorage',
      () => {
        localStorage.setItem('jwt', 'anothertoken');
        expect(service.getToken()).toEqual('anothertoken');
    });
  });

  describe('removeToken', () => {
    it('should remove stored token from localStorage',
      () => {
        localStorage.setItem('jwt', 'anothertoken');
        expect(service.getToken()).toEqual('anothertoken');
        service.removeToken();
        expect(service.getToken()).toBeNull();
    });
  });
});

// import { fakeAsync, TestBed } from '@angular/core/testing';
// import { JwtHelperService } from '@auth0/angular-jwt';

// import { TokenService } from './token.service';

// describe('TokenService', () => {
//   let service: TokenService;
//   let fakeJwtService: jasmine.SpyObj<JwtHelperService>;
  
//   const setup = async (fakeJwtServiceReturnValues?: jasmine.SpyObjMethodNames<JwtHelperService>) => {

//     fakeJwtService = jasmine.createSpyObj<JwtHelperService>(
//       'JwtHelperService',
//       {
//           decodeToken: undefined,
//           getAuthScheme: undefined,
//           getTokenExpirationDate: undefined,
//           isTokenExpired: undefined,
//           tokenGetter:undefined,
//           urlBase64Decode: undefined,
//         ...fakeJwtServiceReturnValues
//       }
//     );

//     await TestBed.configureTestingModule({
//       providers: [{ provide: JwtHelperService, useValue: fakeJwtService }]
//     })
//     service = TestBed.inject(TokenService);
//   };

//   it('should be created', fakeAsync(async() => {
//     await setup();
//     expect(service).toBeTruthy();
//   }));
// });