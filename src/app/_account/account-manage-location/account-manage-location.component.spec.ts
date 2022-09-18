import { AccountManageLocationComponent } from './account-manage-location.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dispatchFakeEvent, expectText, findComponent, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';
import { AccountService } from '../account.service';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmEmailComponent } from '../confirm-email/confirm-email.component';
import { AccountValidationService } from '../account-validation.service';
import { of, throwError } from 'rxjs';
import { Mock, MockComponent, MockRender } from 'ng-mocks';
import {
    registerModel,
    username,
    password,
    confirmPassword,
    email,
    newLatitude,
    newLongitude,
    locationModel,
    newAccountLocationMapMarker
} from 'src/app/testing/account-tests-helpers';
import { LoginComponent } from 'src/app/_auth/login/login.component';
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

    beforeEach(async () => {

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
                //...fakeAccountServiceReturnValues // Overwrite with given return values
            }
        );

        fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
            'AuthenticationService',
            {
                checkAuthStatus: undefined,
                logout: undefined,
                // ...fakeAuthReturnValues
            },
            {
                isAuthorisedObservable: of(false),
                isAuthorised: false,
                getAuthUser: of(userModel),
                // ...fakeAuthPropertyValues
            },
        )

        await TestBed.configureTestingModule({
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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('renders an independent counter', () => {
        expect(map).toBeTruthy();
    });

    it('passes a start count', () => {
        expect(map.latitude).toBe(originalLatitude);
        expect(map.longitude).toBe(originalLongitude);
    });


    it('passes a start count', () => {
        expect(map.latitude).toBe(originalLatitude);
        expect(map.longitude).toBe(originalLongitude);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

        map.locationMarker = newAccountLocationMapMarker;

        fixture.detectChanges();
        // let btn = fixture.debugElement.query(By.css('btn'));
        // btn.triggerEventHandler('click', null);
        // fixture.detectChanges();

        // findEl(fixture, 'save').triggerEventHandler('click', null);

        // let button = fixture.debugElement.nativeElement.querySelector('btn');
        // button.click(); 
        fixture.debugElement.query(By.css('button')).triggerEventHandler('click', null);

        //tick(1000);
        // fixture.detectChanges();
        expect(fakeAccountService.postUpdateLocation).toHaveBeenCalledWith(locationModel);
    });
});