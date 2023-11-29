import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NavMenuComponent } from './nav-menu.component';
import { Router, provideRouter } from '@angular/router';
import { blankRoutesArray } from '../testing/route-tests-helpers';
import { authUserName, userModel } from '../testing/auth-test-helpers';
import { AuthenticationService } from '../_auth/authentication.service';
import { of } from 'rxjs';


describe('NavMenuComponent', () => {
    let component: NavMenuComponent;
    let fixture: ComponentFixture<NavMenuComponent>;

    let fakeService: jasmine.SpyObj<AuthenticationService>;
    let router: Router;

    const setup = async (
        // fakeServiceMethodValues?: jasmine.SpyObjMethodNames<AuthenticationService>,
        fakeServicePropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>) => {

        fakeService = jasmine.createSpyObj<AuthenticationService>(
            'AuthenticationService',
            {
                isLoggedIn: undefined,
                checkAuthStatus: undefined,
                logout: undefined,
                // ...fakeServiceMethodValues
            },
            {
                isAuthorisedObservable: undefined,
                getAuthUser: undefined,
                ...fakeServicePropertyValues
            }
        );

        await TestBed.configureTestingModule({
            imports: [NavMenuComponent],
            providers: [
                provideRouter(blankRoutesArray),
                { provide: AuthenticationService, useValue: fakeService }
            ]
        }).compileComponents();

        router = TestBed.inject(Router);
        spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

        fixture = TestBed.createComponent(NavMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('should create', fakeAsync(async () => {
        await setup();
        expect(component).toBeTruthy();
    }));

    it('should check auth status on initialisation', fakeAsync(async () => {
        await setup();
        expect(fakeService.checkAuthStatus).toHaveBeenCalledTimes(1);
    }));

    describe('when user is authorised', () => {

        it('should show authorised menu content', fakeAsync(async () => {
            await setup({
                isAuthorisedObservable: of(true),
                getAuthUser: of(userModel)
            });

            expect(fakeService.checkAuthStatus).toHaveBeenCalledTimes(1);

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="auth-content"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="auth-username"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="auth-username"]')?.textContent).toContain(authUserName);
            expect(compiled.querySelector('[data-testid="not-auth-content"]')?.textContent).toBeUndefined();
        }));

    });

    describe('when user is not authorised', () => {

        it('should show not authorised menu content', fakeAsync(async () => {
            await setup({
                isAuthorisedObservable: of(false)
            });

            expect(fakeService.checkAuthStatus).toHaveBeenCalledTimes(1);

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="not-auth-content"]')?.textContent).toBeDefined();
            expect(compiled.querySelector('[data-testid="auth-content"]')?.textContent).toBeUndefined();
        }));
    });

});
