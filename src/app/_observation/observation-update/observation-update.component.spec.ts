import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router, Routes } from '@angular/router';
import { of, throwError } from 'rxjs';
import { singleObservationAuthUser, updateObservationModel } from 'src/app/testing/observation-test-helpers';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { ObservationCrudService } from '../observation-crud.service';
import { ObservationReadComponent } from '../observation-read/observation-read.component';
import { ObservationUpdateComponent } from './observation-update.component';
import { userModel } from 'src/app/testing/auth-test-helpers';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { SelectSpeciesComponent } from '../select-species/select-species.component';
import { SelectDateTimeComponent } from '../select-date-time/select-date-time.component';
import { ReadWriteMapComponent } from 'src/app/_map/read-write-map/read-write-map.component';
import { MockComponent } from 'ng-mocks';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { IAuthUser } from 'src/app/_auth/i-auth-user.dto';

describe('ObservationUpdateComponent', () => {
  let component: ObservationUpdateComponent;
  let fixture: ComponentFixture<ObservationUpdateComponent>;
  let loader: HarnessLoader;
  let router: Router;

  let dateTimePicker: SelectDateTimeComponent;

  // let fakeObservationReadService: jasmine.SpyObj<ObservationCreateComponent>;
  let fakeAuthService: AuthenticationService;
  let fakeNavService: NavigationService;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;

  let fakeObservationCrudService: jasmine.SpyObj<ObservationCrudService>;

  fakeNavService = jasmine.createSpyObj<NavigationService>(
    'NavigationService',
    {
      back: undefined
    }
  );

  const routes: Routes = [
    { path: 'login', component: ObservationReadComponent }
  ];

  const setup = async (
    fakeCrudMethodValues?: jasmine.SpyObjMethodNames<ObservationCrudService>,
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>,
    fakeRouteArgument?: string) => {


    fakeObservationCrudService = jasmine.createSpyObj<ObservationCrudService>(
      'ObservationCrudService',
      {
        getObservation: undefined,
        updateObservation: undefined,
        addObservation: undefined,
        deleteObservation: undefined,
        ...fakeCrudMethodValues
      });

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined
      },
      {
        isAuthorisedObservable: undefined,
        getAuthUser: of(null),
        ...fakeAuthPropertyValues
      }
    );

    fakeAnnounceChangesService = jasmine.createSpyObj<AnnounceChangesService>(
      'AnnounceChangesService',
      {
        announceNetworkChanged: undefined,
        announceObservationsChanged: undefined
      });

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule, ObservationUpdateComponent], //MatStepperModule
      providers: [
        provideRouter(routes),
        // {
        //   provide: ActivatedRoute,
        //   useValue: {
        //     paramMap: of(new Map(Object.entries({
        //       id: fakeRouteArgument
        //     })))
        //     // needs to be a 'Map' object otherwise "map.get is not a function" error occurs
        //     // see: https://bobbyhadz.com/blog/javascript-typeerror-map-get-is-not-a-function#:~:text=get%20is%20not%20a%20function%22%20error%20occurs%20when%20we%20call,the%20method%20on%20Map%20objects.
        //   }
        // },
        { provide: AnnounceChangesService, useValue: fakeAnnounceChangesService },
        { provide: ObservationCrudService, useValue: fakeObservationCrudService },
        { provide: NavigationService, useValue: fakeNavService },
        { provide: AuthenticationService, useValue: fakeAuthService }
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(ObservationUpdateComponent, {
        remove: { imports: [SelectSpeciesComponent, SelectDateTimeComponent, ReadWriteMapComponent] },
        add: { imports: [MockComponent(SelectSpeciesComponent), MockComponent(SelectDateTimeComponent), MockComponent(ReadWriteMapComponent)] },
      })
      .compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(ObservationUpdateComponent);
    component = fixture.componentInstance;
    component.id = fakeRouteArgument ?? '';
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  };


  describe('when component is created', () => {

    it('should be created and show the loading placeloader', fakeAsync(async () => {
      await setup();

      expect(component).toBeTruthy();

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    }));

    it('should get the id from the route and call data fetch', fakeAsync(async () => {
      const expectedRouteArgument = '10';

      await setup({
        getObservation: of(singleObservationAuthUser)
      }, {}, expectedRouteArgument);

      expect(fakeObservationCrudService.getObservation).toHaveBeenCalledOnceWith(expectedRouteArgument);
    }));

    it('should redirect when route argument is null', fakeAsync(async () => {
      const expectedRouteArgument = '';

      await setup({}, {}, expectedRouteArgument);

      expect(fakeObservationCrudService.getObservation).not.toHaveBeenCalled();
      expect(fakeNavService.back).toHaveBeenCalled();
    }));
  });

  describe('when record cannot be fetched', () => {

    it('should show error section', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: throwError(() => new Error('location update error'))
      }, {}, expectedRouteArgument);

      expect(fakeObservationCrudService.getObservation).toHaveBeenCalledOnceWith(expectedRouteArgument);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="loading-error-section"]')).toBeTruthy();

      const btn = await loader.getHarness(MatButtonHarness.with({ text: 'Try Again' }));
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toBe('Try Again');
    });

    it('should retry on button click', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: throwError(() => new Error('location update error'))
      }, {}, expectedRouteArgument);

      expect(fakeObservationCrudService.getObservation).toHaveBeenCalledOnceWith(expectedRouteArgument);

      const btn = await loader.getHarness(MatButtonHarness.with({ text: 'Try Again' }));
      await btn.click();

      expect(fakeObservationCrudService.getObservation).toHaveBeenCalledTimes(2);
    });
  });

  describe('when observation is successfully loaded', () => {

    it('should show render the update observation form', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      expect(fakeObservationCrudService.getObservation).toHaveBeenCalledOnceWith(expectedRouteArgument);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="form"]')).toBeTruthy();
    });

    it('should load quantity input with correct setup', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const input = await loader.getHarness(MatInputHarness.with({ selector: '#quantity' }));
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('number');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe(updateObservationModel.quantity.toString());
    });

    it('should render child component with select species form/control', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const { debugElement } = fixture;
      const counter = debugElement.query(By.css('app-select-species'));
      expect(counter).toBeTruthy();
    });

    it('should render child component with select date/time form/control', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const { debugElement } = fixture;
      const counter = debugElement.query(By.css('app-select-date-time'));
      expect(counter).toBeTruthy();
    });

    it('should show valid form menu', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const counterEl = fixture.debugElement.query(
        By.directive(SelectDateTimeComponent)
      );
      dateTimePicker = counterEl.componentInstance;
      let dt = new Date(new Date().getFullYear() - 10, 0, 1).toISOString();
      dateTimePicker.dateTime = dt;
      dateTimePicker.dateTimeValid.next(true);

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="valid-form-menu"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="valid-form-menu"]')?.textContent).toContain('The form is complete. Choose "Update" to save the changes.');
    });
  });

  describe('checks the authorisation status', () => {

    it('should show "not authorised" message if not record owner', async () => {
      const expectedRouteArgument = '1';

      const notAuthorisedUser = <IAuthUser>{ // observation.username !== authUser.userName
        userName: 'not authorised user',
        avatar: 'avatar',
        defaultLocationLatitude: 1,
        defaultLocationLongitude: 1
      }

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(notAuthorisedUser)
      }, expectedRouteArgument);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="not-authorised"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="not-authorised"]')?.textContent).toContain('Only the record owner is allowed to update their record');
    });

    it('should  redirect on request, if not authorised', async () => {
      const expectedRouteArgument = '1';

      const notAuthorisedUser = <IAuthUser>{ // observation.username !== authUser.userName
        userName: 'not authorised user',
        avatar: 'avatar',
        defaultLocationLatitude: 1,
        defaultLocationLongitude: 1
      }

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(notAuthorisedUser)
      }, expectedRouteArgument);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="not-authorised"]')).toBeTruthy();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Go back' }));
      await submitBtn.click();

      expect(fakeNavService.back).toHaveBeenCalled();
    });

    it('should NOT show "not authorised" message if record owner', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="not-authorised"]')).toBeFalsy();
    });
  });

  describe('filling out the form', () => {

    it('should show quantity required validation messages when input is touched but empty', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      fixture.componentInstance.updateObservationForm.get('quantity')?.setValue('');

      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#quantity' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      expect(await formField.getTextErrors()).toEqual(['This field is required.']);

      fixture.componentInstance.updateObservationForm.get('quantity')?.setValue('');
      expect(await formField.isControlValid()).toBe(false);
    });

    it('should show quantity MINIMUM validation messages when 0', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#quantity' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      // expect(await formField.getTextErrors()).toEqual(['This field is required.']);

      fixture.componentInstance.updateObservationForm.get('quantity')?.setValue('0');
      expect(await formField.getTextErrors()).toEqual(['The minimum value is 1 individual.']);
      expect(await formField.isControlValid()).toBe(false);
    });

    it('should show quantity MAXIMUM validation message when > 1000', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#quantity' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      // expect(await formField.getTextErrors()).toEqual(['This field is required.']);

      fixture.componentInstance.updateObservationForm.get('quantity')?.setValue('1001');
      expect(await formField.getTextErrors()).toEqual(['The maximum value is 1000 individuals.']);
      expect(await formField.isControlValid()).toBe(false);
    });

    it('should show invalid form menu when form is not valid', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel)
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      fixture.componentInstance.updateObservationForm.get('quantity')?.setValue('');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="invalid-form-menu"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="invalid-form-menu"]')?.textContent).toContain('The form is not complete. You must complete the manadatory fields in Section 1.');
    });
  });

  describe('to submit the form', () => {

    it('should submit the valid form and call the service', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel),
        updateObservation: of({ observationId: expectedRouteArgument })
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const counterEl = fixture.debugElement.query(
        By.directive(SelectDateTimeComponent)
      );
      dateTimePicker = counterEl.componentInstance;
      let dt = new Date(new Date().getFullYear() - 10, 0, 1).toISOString();
      dateTimePicker.dateTime = dt;
      dateTimePicker.dateTimeValid.next(true);

      fixture.detectChanges();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update' }));
      await submitBtn.click();

      expect(fakeObservationCrudService.updateObservation).toHaveBeenCalledTimes(1);
      expect(fakeAnnounceChangesService.announceObservationsChanged).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/observation/detail/' + expectedRouteArgument]);
    });

    it('show error message on service error', async () => {
      const expectedRouteArgument = '1';

      await setup({
        getObservation: of(updateObservationModel),
        updateObservation: throwError(() => new Error('location update error'))
      }, {
        getAuthUser: of(userModel)
      }, expectedRouteArgument);

      const counterEl = fixture.debugElement.query(
        By.directive(SelectDateTimeComponent)
      );
      dateTimePicker = counterEl.componentInstance;
      let dt = new Date(new Date().getFullYear() - 10, 0, 1).toISOString();
      dateTimePicker.dateTime = dt;
      dateTimePicker.dateTimeValid.next(true);

      fixture.detectChanges();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Update' }));
      await submitBtn.click();

      expect(fakeObservationCrudService.updateObservation).toHaveBeenCalledTimes(1);
      expect(fakeAnnounceChangesService.announceObservationsChanged).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="record-update-error"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="record-update-error"]')?.textContent).toContain('There was an error updating the observation. Please try again.');
    });
  });
});
