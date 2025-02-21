import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { ObservationCrudService } from '../observation-crud.service';
import { ObservationReadComponent } from '../observation-read/observation-read.component';
import { ObservationCreateComponent } from './observation-create.component';
import { SelectSpeciesComponent } from '../select-species/select-species.component';
import { SelectDateTimeComponent } from '../select-date-time/select-date-time.component';
import { ReadWriteMapComponent } from 'src/app/_map/read-write-map/read-write-map.component';
import { MockComponent } from 'ng-mocks';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router, Routes } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { BirdsListValidator } from 'src/app/_validators';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { By } from '@angular/platform-browser';
import { userModel } from 'src/app/testing/auth-test-helpers';
import { fakeIBirdSummary } from 'src/app/testing/birds-helpers';
import { findComponent } from 'src/app/testing/element.spec-helper';
import { ComponentRef } from '@angular/core';

const routes: Routes = [{ path: 'login', component: ObservationReadComponent }];

describe('ObservationCreateComponent', () => {
  let component: ObservationCreateComponent;
  // let componentRef: ComponentRef<ObservationCreateComponent>;
  let fixture: ComponentFixture<ObservationCreateComponent>;
  let loader: HarnessLoader;
  let router: Router;

  let dateTimePicker: SelectDateTimeComponent;

  let fakeAuthService: AuthenticationService;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;
  let fakeObservationCrudService: jasmine.SpyObj<ObservationCrudService>;

  const setup = async (
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>,
    fakeServiceMethodValues?: jasmine.SpyObjMethodNames<ObservationCrudService>
  ) => {
    fakeObservationCrudService = jasmine.createSpyObj<ObservationCrudService>(
      'ObservationCrudService',
      {
        getObservation: undefined,
        updateObservation: undefined,
        addObservation: undefined,
        deleteObservation: undefined,
        ...fakeServiceMethodValues,
      }
    );

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined,
      },
      {
        isAuthorisedObservable: of(true),
        getAuthUser: of(userModel),
        ...fakeAuthPropertyValues,
      }
    );

    fakeAnnounceChangesService = jasmine.createSpyObj<AnnounceChangesService>(
      'AnnounceChangesService',
      {
        announceNetworkChanged: undefined,
        announceObservationsChanged: undefined,
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        BrowserAnimationsModule,
        ObservationCreateComponent,
      ],
      // declarations: [SelectSpeciesComponent],
      providers: [
        {
          provide: AnnounceChangesService,
          useValue: fakeAnnounceChangesService,
        },
        {
          provide: ObservationCrudService,
          useValue: fakeObservationCrudService,
        },
        { provide: AuthenticationService, useValue: fakeAuthService },
        provideRouter(routes),
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(ObservationCreateComponent, {
        remove: {
          imports: [
            SelectSpeciesComponent,
            SelectDateTimeComponent,
            ReadWriteMapComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(SelectSpeciesComponent),
            MockComponent(SelectDateTimeComponent),
            MockComponent(ReadWriteMapComponent),
          ],
        },
      })
      .compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(ObservationCreateComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    // componentRef = fixture.componentRef;
    // .set.setInput('observation', fakeIObservationFeedSingleItem);

    component.selectSpeciesForm = new FormGroup({
      bird: new FormControl(
        fakeIBirdSummary,
        Validators.compose([Validators.required, BirdsListValidator()])
      ),
    });

    fixture.detectChanges();

    const counterEl = fixture.debugElement.query(
      By.directive(SelectDateTimeComponent)
    );
    dateTimePicker = counterEl.componentInstance;
    let dt = new Date(new Date().getFullYear() - 10, 0, 1).toISOString();
    // dateTimePicker.dateTime = dt;
  };

  it('SMOKE TEST: should be created', fakeAsync(async () => {
    await setup();
    expect(component).toBeTruthy();
    expect(dateTimePicker).toBeTruthy();
    // console.log(dateTimePicker);
    // expect(dateTimePicker.isValid).toBe(true);
    // expect(dateTimePicker.dateTime).toBe(new Date(new Date().getFullYear() - 10, 0, 1).toISOString())
  }));

  // describe('STEPPER CONTROL TESTS', () => {

  // });

  describe('initial form setup (form invalid)', () => {
    it('should show invalid form message', async () => {
      await setup();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="invalid-form-msg"]')?.textContent
      ).toBeTruthy();
    });

    it('should show invalid form back button', async () => {
      await setup();

      const btn = await loader.getHarness(
        MatButtonHarness.with({ selector: '#back-form-invalid' })
      );
      expect(await btn.getText()).toBe('Back');
      expect(btn).toBeTruthy();
    });

    it('should load quantity input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#quantity' })
      );
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('number');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should render child component with select species form/control', async () => {
      await setup();

      const { debugElement } = fixture;
      const counter = debugElement.query(By.css('app-select-species'));
      expect(counter).toBeTruthy();
    });

    it('should render child component with select date/time form/control', async () => {
      await setup();

      const { debugElement } = fixture;
      const counter = debugElement.query(By.css('app-select-date-time'));
      expect(counter).toBeTruthy();
    });
  });

  describe('filling out the form', () => {
    it('should show quantity required validation messages when input is touched but empty', async () => {
      await setup();
      const formField = await loader.getHarness(
        MatFormFieldHarness.with({ selector: '#quantity' })
      );
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(
        true
      );
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      expect(await formField.getTextErrors()).toEqual([
        'This field is required.',
      ]);

      // fixture.componentInstance.addObservationForm.get('quantity')?.setValue('');
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#quantity' })
      );
      expect(await input.getValue()).toBe('');
      await input.setValue('');

      expect(await formField.isControlValid()).toBe(false);
    });

    it('should show quantity MINIMUM validation messages when 0', async () => {
      await setup();
      const formField = await loader.getHarness(
        MatFormFieldHarness.with({ selector: '#quantity' })
      );
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(
        true
      );
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      // expect(await formField.getTextErrors()).toEqual(['This field is required.']);

      // fixture.componentInstance.addObservationForm.get('quantity')?.setValue('0');
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#quantity' })
      );
      expect(await input.getValue()).toBe('');
      await input.setValue('0');

      expect(await formField.getTextErrors()).toEqual([
        'The minimum value is 1 individual.',
      ]);
      expect(await formField.isControlValid()).toBe(false);
    });

    it('should show quantity MAXIMUM validation message when > 1000', async () => {
      await setup();
      const formField = await loader.getHarness(
        MatFormFieldHarness.with({ selector: '#quantity' })
      );
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(
        true
      );
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      // expect(await formField.getTextErrors()).toEqual(['This field is required.']);

      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#quantity' })
      );
      expect(await input.getValue()).toBe('');
      await input.setValue('1001');

      // fixture.componentInstance.addObservationForm.get('quantity')?.setValue('1001');
      // await formField.getControl(MatInputHarness.with({ selector: '#name' })). .setValue(name);

      expect(await formField.getTextErrors()).toEqual([
        'The maximum value is 1000 individuals.',
      ]);
      expect(await formField.isControlValid()).toBe(false);
    });
  });

  describe('SUBMITTING A VALID FORM', () => {
    it('should render the valid form section when form is valid', async () => {
      await setup();

      fixture.componentInstance.selectSpeciesForm
        .get('bird')
        ?.setValue(fakeIBirdSummary);
      // fixture.componentInstance.addObservationForm.get('quantity')?.setValue('1');

      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#quantity' })
      );
      expect(await input.getValue()).toBe('');
      await input.setValue('1');

      // dateTimePicker.dateTimeValid.emit(true);
      // const counter = findComponent(fixture, 'app-select-date-time');
      // const count = 5;
      // counter.triggerEventHandler('dateTimeValid', true);

      // fixture.componentInstance.

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="valid-form-section"]')
      ).toBeTruthy();

      const submitBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Save' })
      );
      expect(await submitBtn.isDisabled()).toBe(false);
      expect(await submitBtn.getText()).toBe('Save');

      const resetBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Reset' })
      );
      expect(await resetBtn.isDisabled()).toBe(false);
      expect(await resetBtn.getText()).toBe('Reset');
    });

    it('should submit the valid form and call the service', async () => {
      await setup(
        {},
        {
          addObservation: of({ observationId: '1' }),
        }
      );

      fixture.componentInstance.selectSpeciesForm
        .get('bird')
        ?.setValue(fakeIBirdSummary);
      // fixture.componentInstance.addObservationForm.get('quantity')?.setValue('1');
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#quantity' })
      );
      expect(await input.getValue()).toBe('');
      await input.setValue('1');
      // dateTimePicker.dateTimeValid.emit(true);

      const submitBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Save' })
      );
      await submitBtn.click();

      expect(fakeObservationCrudService.addObservation).toHaveBeenCalledTimes(
        1
      );
      expect(
        fakeAnnounceChangesService.announceObservationsChanged
      ).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/observation/detail/1']);
    });

    it('show error message on service error', async () => {
      await setup(
        {},
        {
          addObservation: throwError(() => new Error('location update error')),
        }
      );

      fixture.componentInstance.selectSpeciesForm
        .get('bird')
        ?.setValue(fakeIBirdSummary);
      // fixture.componentInstance.addObservationForm.get('quantity')?.setValue('1');
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#quantity' })
      );
      expect(await input.getValue()).toBe('');
      await input.setValue('1');
      // dateTimePicker.dateTimeValid.emit(true);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="form-submission-error-msg"]')
      ).toBeFalsy();

      const submitBtn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Save' })
      );
      await submitBtn.click();

      expect(fakeObservationCrudService.addObservation).toHaveBeenCalledTimes(
        1
      );
      expect(
        fakeAnnounceChangesService.announceObservationsChanged
      ).not.toHaveBeenCalledTimes(1);
      expect(router.navigate).not.toHaveBeenCalled();

      fixture.detectChanges();

      expect(
        compiled.querySelector('[data-testid="form-submission-error-msg"]')
          ?.textContent
      ).toBeTruthy();
    });
  });
});
