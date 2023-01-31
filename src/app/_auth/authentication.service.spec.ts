import { fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { fakeDecodedToken, userModel } from '../testing/auth-test-helpers';
import { AuthenticationService } from './authentication.service';
import { IAuthUser } from './i-auth-user.dto';
import { LoginComponent } from './login/login.component';
import { TokenService } from './token.service';



describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let fakeJwtService: jasmine.SpyObj<JwtHelperService>;
    let fakeTokenService: jasmine.SpyObj<TokenService>;

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

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([
                { path: 'login', component: LoginComponent },
            ])],
            providers: [AuthenticationService,
                { provide: JwtHelperService, useValue: fakeJwtService },
                { provide: TokenService, useValue: fakeTokenService },
            ]
        })
        service = TestBed.inject(AuthenticationService);
    };

    it('SMOKE TEST: should be created', fakeAsync(async () => {
        await setup();
        expect(service).toBeTruthy();
    }));

    // todo: change describe and it names...................................................
    describe('checks authentication status - checkAuthStatus()', () => {

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

        //     it('gets null and false status when not authenticated', fakeAsync(async () => {
        //         await setup({
        //             isTokenValid: false,
        //             getUser: null
        //         })

        //         let actualIsAuthenticatedObsState: boolean | undefined;
        //         //let actualIsAuthenticatedState: boolean | undefined;
        //         let actualAuthenicatedUserState: IAuthUser | null | undefined;

        //         service.checkAuthStatus();

        //         service.getAuthUser.subscribe((obs) => {
        //             actualAuthenicatedUserState = obs
        //         });

        //         service.isAuthorisedObservable.subscribe((obs) => {
        //             actualIsAuthenticatedObsState = obs
        //         })

        //         //actua//lIsAuthenticatedState = service.isAuthorised;

        //         expect(actualAuthenicatedUserState).toBeNull();
        //         expect(actualIsAuthenticatedObsState).toBeFalse();
        //         //(actualIsAuthenticatedState).toBeFalse();

        //         expect(fakeTokenService.isTokenValid).toHaveBeenCalled();
        //         expect(fakeTokenService.getUser).toHaveBeenCalled();
        //     }));
    });

    // describe('IsLoggedIn method ', () => {

    //     //TODO: Test if router is called / not called

    //     it('returns false and redirects to login when token is invalid', fakeAsync(async () => {
    //         await setup({
    //             removeToken: undefined,
    //             isTokenValid: false,
    //             getUser: null
    //         })

    //         let actualIsAuthenticatedObsState: boolean | undefined;

    //         service.isLoggedIn();

    //         service.isAuthorisedObservable.subscribe((obs) => {
    //             actualIsAuthenticatedObsState = obs
    //         })

    //         expect(actualIsAuthenticatedObsState).toBeFalse();
    //         expect(fakeTokenService.isTokenValid).toHaveBeenCalled();
    //     }));


    //     it('returns authentication status when token is valid', fakeAsync(async () => {
    //         await setup({
    //             removeToken: undefined,
    //             isTokenValid: true,
    //             getUser: null
    //         })

    //         let actualIsAuthenticatedObsState: boolean | undefined;

    //         service.isLoggedIn();

    //         service.isAuthorisedObservable.subscribe((obs) => {
    //             actualIsAuthenticatedObsState = obs
    //         })

    //         expect(actualIsAuthenticatedObsState).toBeFalse();
    //         expect(fakeTokenService.isTokenValid).toHaveBeenCalled();
    //     }));

    // });

    // describe('logs out - logout()', () => {

    //     it('gets user and true status when authenticated', fakeAsync(async () => {
    //         await setup({
    //             removeToken: undefined,
    //             isTokenValid: false,
    //             getUser: null
    //         })

    //         let actualIsAuthenticatedObsState: boolean | undefined;
    //         //let actualIsAuthenticatedState: boolean | undefined;
    //         let actualAuthenicatedUserState: IAuthUser | null | undefined;

    //         service.logout();

    //         service.getAuthUser.subscribe((obs) => {
    //             actualAuthenicatedUserState = obs
    //         });

    //         service.isAuthorisedObservable.subscribe((obs) => {
    //             actualIsAuthenticatedObsState = obs
    //         })

    //         //actualIsAuthenticatedState = service.isAuthorised;


    //         expect(actualAuthenicatedUserState).toBeNull();
    //         expect(actualIsAuthenticatedObsState).toBeFalse();
    //         //expect(actualIsAuthenticatedState).toBeFalse();

    //         expect(fakeTokenService.removeToken).toHaveBeenCalled();
    //         expect(fakeTokenService.isTokenValid).toHaveBeenCalled();
    //         expect(fakeTokenService.getUser).toHaveBeenCalled();
    //     }));
    // });

});