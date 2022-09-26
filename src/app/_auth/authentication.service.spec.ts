import { fakeAsync, TestBed } from '@angular/core/testing';
import { userModel } from '../testing/auth-test-helpers';
import { AuthenticationService } from './authentication.service';
import { IAuthUser } from './i-auth-user.dto';
import { TokenService } from './token.service';

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let fakeTokenService: jasmine.SpyObj<TokenService>;

    const setup = async (fakeTokenReturnValues?: jasmine.SpyObjMethodNames<TokenService>) => {

        fakeTokenService = jasmine.createSpyObj<TokenService>(
            'TokenService',
            {
                addToken: undefined,
                getToken: undefined,
                getUser: undefined,
                isTokenValid: undefined,
                removeToken: undefined,
                ...fakeTokenReturnValues
            }
        );

        await TestBed.configureTestingModule({
            providers: [AuthenticationService,
                { provide: TokenService, useValue: fakeTokenService }]
        })
        service = TestBed.inject(AuthenticationService);
    };

    it('should be created', fakeAsync(async () => {
        await setup();
        expect(service).toBeTruthy();
    }));

    describe('checks authentication status - checkAuthStatus()', () => {

        it('gets user and true status when authenticated', fakeAsync(async () => {
            await setup({
                isTokenValid: true,
                getUser: userModel
            })

            let actualIsAuthenticatedObsState: boolean | undefined;
            let actualIsAuthenticatedState: boolean | undefined;
            let actualAuthenicatedUserState: IAuthUser | null | undefined;

            service.checkAuthStatus();

            service.getAuthUser.subscribe((obs) => {
                actualAuthenicatedUserState = obs
            });

            service.isAuthorisedObservable.subscribe((obs) => {
                actualIsAuthenticatedObsState = obs
            })

            actualIsAuthenticatedState = service.isAuthorised;

            expect(actualAuthenicatedUserState).toEqual(userModel);
            expect(actualIsAuthenticatedObsState).toBeTrue();
            expect(actualIsAuthenticatedState).toBeTrue();

            expect(fakeTokenService.isTokenValid).toHaveBeenCalled();
            expect(fakeTokenService.getUser).toHaveBeenCalled();
        }));

        it('gets null and false status when not authenticated', fakeAsync(async () => {
            await setup({
                isTokenValid: false,
                getUser: null
            })

            let actualIsAuthenticatedObsState: boolean | undefined;
            let actualIsAuthenticatedState: boolean | undefined;
            let actualAuthenicatedUserState: IAuthUser | null | undefined;

            service.checkAuthStatus();

            service.getAuthUser.subscribe((obs) => {
                actualAuthenicatedUserState = obs
            });

            service.isAuthorisedObservable.subscribe((obs) => {
                actualIsAuthenticatedObsState = obs
            })

            actualIsAuthenticatedState = service.isAuthorised;

            expect(actualAuthenicatedUserState).toBeNull();
            expect(actualIsAuthenticatedObsState).toBeFalse();
            expect(actualIsAuthenticatedState).toBeFalse();

            expect(fakeTokenService.isTokenValid).toHaveBeenCalled();
            expect(fakeTokenService.getUser).toHaveBeenCalled();
        }));
    });

    describe('logs out - logout()', () => {

        it('gets user and true status when authenticated', fakeAsync(async () => {
            await setup({
                removeToken: undefined,
                isTokenValid: false,
                getUser: null
            })

            let actualIsAuthenticatedObsState: boolean | undefined;
            let actualIsAuthenticatedState: boolean | undefined;
            let actualAuthenicatedUserState: IAuthUser | null | undefined;

            service.logout();

            service.getAuthUser.subscribe((obs) => {
                actualAuthenicatedUserState = obs
            });

            service.isAuthorisedObservable.subscribe((obs) => {
                actualIsAuthenticatedObsState = obs
            })

            actualIsAuthenticatedState = service.isAuthorised;


            expect(actualAuthenicatedUserState).toBeNull();
            expect(actualIsAuthenticatedObsState).toBeFalse();
            expect(actualIsAuthenticatedState).toBeFalse();

            expect(fakeTokenService.removeToken).toHaveBeenCalled();
            expect(fakeTokenService.isTokenValid).toHaveBeenCalled();
            expect(fakeTokenService.getUser).toHaveBeenCalled();
        }));
    });
});