import { fakeAsync, TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { fakeDecodedToken, userModel } from '../testing/auth-test-helpers';
import { AuthenticationService } from './authentication.service';
import { IAuthUser } from './i-auth-user.dto';
import { LoginComponent } from './login/login.component';
import { TokenService } from './token.service';

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let fakeJwtService: jasmine.SpyObj<JwtHelperService>;
    let fakeTokenService: jasmine.SpyObj<TokenService>;
    let routerStub: any;

    const routes: Routes = [
        { path: 'login', component: LoginComponent }
    ];

    const setup = async (fakeJwtReturnValues?: jasmine.SpyObjMethodNames<JwtHelperService>,
        fakeTokenServicereturnValues?: jasmine.SpyObjMethodNames<TokenService>) => {

        fakeJwtService = jasmine.createSpyObj<JwtHelperService>(
            'JwtHelperService',
            {
                isTokenExpired: undefined,
                decodeToken: undefined,
                getAuthScheme: undefined,
                getTokenExpirationDate: undefined,
                tokenGetter: undefined,
                urlBase64Decode: undefined,
                ...fakeJwtReturnValues
            }
        );

        fakeTokenService = jasmine.createSpyObj<TokenService>(
            'TokenService',
            {
                addToken: undefined,
                getToken: '',
                removeToken: undefined,
                ...fakeTokenServicereturnValues
            }
        );

        routerStub = {
            navigate: jasmine.createSpy('navigate'),
        };

        await TestBed.configureTestingModule({
            providers: [provideRouter(routes),
            AuthenticationService,
            { provide: JwtHelperService, useValue: fakeJwtService },
            { provide: TokenService, useValue: fakeTokenService },
            { provide: Router, useValue: routerStub }
            ]
        })
        service = TestBed.inject(AuthenticationService);
    };

    it('SMOKE TEST: should be created', fakeAsync(async () => {
        await setup();
        expect(service).toBeTruthy();
    }));

    describe('when checkAuthStatus()', () => {

        it('gets user and true status when authenticated', fakeAsync(async () => {
            await setup({
                decodeToken: fakeDecodedToken
            }, {
                getToken: 'token'
            });

            let actualIsAuthenticatedObsState: boolean | undefined;
            let actualAuthenicatedUserState: IAuthUser | null | undefined;

            service.checkAuthStatus();

            service.getAuthUser.subscribe((obs) => {
                actualAuthenicatedUserState = obs
            });

            service.isAuthorisedObservable.subscribe((obs) => {
                actualIsAuthenticatedObsState = obs
            });

            expect(actualAuthenicatedUserState).toEqual(userModel);
            expect(actualIsAuthenticatedObsState).toBeTrue();
            expect(fakeJwtService.isTokenExpired).toHaveBeenCalled();
            expect(fakeJwtService.decodeToken).toHaveBeenCalled();
        }));

        it('gets null and false status when not authenticated', fakeAsync(async () => {
            await setup({}, {
                getToken: null
            });

            let actualIsAuthenticatedObsState: boolean | undefined;
            let actualAuthenicatedUserState: IAuthUser | null | undefined;

            service.checkAuthStatus();

            service.getAuthUser.subscribe((obs) => {
                actualAuthenicatedUserState = obs
            });

            service.isAuthorisedObservable.subscribe((obs) => {
                actualIsAuthenticatedObsState = obs
            })

            expect(actualAuthenicatedUserState).toBeNull();
            expect(actualIsAuthenticatedObsState).toBeFalse();
            expect(fakeTokenService.removeToken).toHaveBeenCalled();
            //not called because short circuit as token is falsy (null or '')
            expect(fakeJwtService.isTokenExpired).not.toHaveBeenCalled();
            expect(fakeJwtService.decodeToken).not.toHaveBeenCalled();
        }));
    });



    describe('when IsLoggedIn() is called ', () => {

        it('should return false and redirect to Home when token is invalid', fakeAsync(async () => {
            await setup({}, {
                getToken: ''
            });

            const result = service.isLoggedIn();

            expect(fakeTokenService.getToken).toHaveBeenCalled();
            expect(fakeTokenService.removeToken).toHaveBeenCalled();

            //not called because short circuit as token is falsy (null or '')
            expect(fakeJwtService.isTokenExpired).not.toHaveBeenCalled();
            expect(routerStub.navigate).toHaveBeenCalledWith(['/home']);
        }));


        it('should return true when token is valid', fakeAsync(async () => {
            await setup({}, {
                getToken: 'token'
            });

            const result = service.isLoggedIn();

            expect(result).toBeTrue();
            expect(fakeTokenService.getToken).toHaveBeenCalled();
            expect(fakeTokenService.removeToken).not.toHaveBeenCalled();

            //not called because short circuit as token is falsy (null or '')
            expect(fakeJwtService.isTokenExpired).toHaveBeenCalled();

            expect(routerStub.navigate).not.toHaveBeenCalledWith(['/login']);
        }));

    });

    describe('when logout() is called', () => {

        it('should remove the toekn and update auth status', fakeAsync(async () => {
            await setup({}, {
                getToken: null
            });

            let actualIsAuthenticatedObsState: boolean | undefined;
            let actualAuthenicatedUserState: IAuthUser | null | undefined;

            service.logout();

            service.getAuthUser.subscribe((obs) => {
                actualAuthenicatedUserState = obs
            });

            service.isAuthorisedObservable.subscribe((obs) => {
                actualIsAuthenticatedObsState = obs
            })

            expect(actualAuthenicatedUserState).toBeNull();
            expect(actualIsAuthenticatedObsState).toBeFalse();
            expect(fakeTokenService.removeToken).toHaveBeenCalled();
            expect(fakeJwtService.isTokenExpired).not.toHaveBeenCalled();
            expect(fakeJwtService.decodeToken).not.toHaveBeenCalled();
        }));
    });
});