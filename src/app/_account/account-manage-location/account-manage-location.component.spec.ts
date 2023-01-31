import { AccountManageLocationComponent } from './account-manage-location.component';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { expectText } from 'src/app/testing/element.spec-helper';
import { AccountService } from '../account.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmEmailComponent } from '../confirm-email/confirm-email.component';
import { of, throwError } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import {
    locationModel,
    newAccountLocationMapMarker
} from 'src/app/testing/account-tests-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { ReadWriteMapComponent } from 'src/app/_map/read-write-map/read-write-map.component';
import { originalLatitude, originalLongitude, userModel } from 'src/app/testing/auth-test-helpers';
import { By } from '@angular/platform-browser';

describe('AccountManageLocationComponent (child with ng-mocks)', () => {
    let fixture: ComponentFixture<AccountManageLocationComponent>;
    let component: AccountManageLocationComponent;
    let map: ReadWriteMapComponent;

    let fakeAuthService: jasmine.SpyObj<AuthenticationService>;
    let fakeAccountService: jasmine.SpyObj<AccountService>;

    const setup = async (
        fakeAccountServiceReturnValues?: jasmine.SpyObjMethodNames<AccountService>) => {

        fakeAccountService = jasmine.createSpyObj<AccountService>(
            'AccountService',
            {
                isEmailTaken: of(false),
                isUsernameTaken: of(false),
                register: undefined,
                requestPasswordReset: undefined,
                resendEmailConfirmation: undefined,
                resetPassword: undefined,
                getUserProfile: undefined,
                postChangePassword: undefined,
                postUpdateLocation: undefined,
                postUpdateProfile: undefined,
                ...fakeAccountServiceReturnValues // Overwrite with given return values
            }
        );

        fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
            'AuthenticationService',
            {
                checkAuthStatus: undefined,
                logout: undefined
                // ...fakeAuthReturnValues
            },
            {
                isAuthorisedObservable: of(false),
                getAuthUser: of(userModel),
                // ...fakeAuthPropertyValues
            },
        )

        await TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    { path: 'login', component: ConfirmEmailComponent },
                ])],
            declarations: [AccountManageLocationComponent, MockComponent(ReadWriteMapComponent)],
            providers: [{ provide: AccountService, useValue: fakeAccountService },
            { provide: AuthenticationService, useValue: fakeAuthService }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountManageLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const mapEl = fixture.debugElement.query(By.directive(ReadWriteMapComponent));
        map = mapEl.componentInstance;
    };

    it('should create parent and child', fakeAsync(async () => {
        await setup();
        expect(component).toBeTruthy();
        expect(map).toBeTruthy();
        expect(map.latitude).toBe(originalLatitude);
        expect(map.longitude).toBe(originalLongitude);
    }));

    it('submits the form successfully', fakeAsync(async () => {
        await setup(
            {
                postUpdateLocation: of({ success: true })
            }
        );

        // update child component with location marker
        // (location marker is set at initialisation, but does not run in this mock/fake/stub)
        // that logic is tested in map component unit tests
        map.locationMarker = newAccountLocationMapMarker;

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

        fixture.debugElement.query(By.css('button')).triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(fakeAccountService.postUpdateLocation).toHaveBeenCalledWith(locationModel);
        expect(component.submitProgress).toBe('success');
        expectText(fixture, 'success', 'Success! You have updated your default location Login');
    }));

    it('reacts to errors', fakeAsync(async () => {
        await setup({
            postUpdateLocation: throwError(() => new Error('location update error'))
        })

        map.locationMarker = newAccountLocationMapMarker;

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

        fixture.debugElement.query(By.css('button')).triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(fakeAccountService.postUpdateLocation).toHaveBeenCalledWith(locationModel);
        expect(component.submitProgress).toBe('error');
        expectText(fixture, 'error', 'Whoops! An error occurred. Please try again.');
    }));
});