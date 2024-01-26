import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
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
import { provideRouter, Routes } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { BirdsListValidator } from 'src/app/_validators';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { By } from '@angular/platform-browser';
import { userModel } from 'src/app/testing/auth-test-helpers';

// STUB the select species child component...
const routes: Routes = [
  { path: 'login', component: ObservationReadComponent }
];


describe('ObservationCreateComponent', () => {
  let component: ObservationCreateComponent;
  let fixture: ComponentFixture<ObservationCreateComponent>;
  let loader: HarnessLoader;

  let fakeAuthService: AuthenticationService;
  let fakeAnnounceChangesService: jasmine.SpyObj<AnnounceChangesService>;
  let fakeObservationCrudService: jasmine.SpyObj<ObservationCrudService>;

  const setup = async (
    fakeAuthPropertyValues?: jasmine.SpyObjPropertyNames<AuthenticationService>) => {

    fakeObservationCrudService = jasmine.createSpyObj<ObservationCrudService>(
      'ObservationCrudService',
      {
        getObservation: undefined,
        updateObservation: undefined,
        addObservation: undefined,
        deleteObservation: undefined
      });

    fakeAuthService = jasmine.createSpyObj<AuthenticationService>(
      'AuthenticationService',
      {
        checkAuthStatus: undefined,
        logout: undefined
      },
      {
        isAuthorisedObservable: of(true),
        getAuthUser: of(userModel),
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
      imports: [FormsModule, ReactiveFormsModule, MatStepperModule, BrowserAnimationsModule, ObservationCreateComponent],
      providers: [{ provide: AnnounceChangesService, useValue: fakeAnnounceChangesService },
      { provide: ObservationCrudService, useValue: fakeObservationCrudService },
      { provide: AuthenticationService, useValue: fakeAuthService },
      provideRouter(routes)],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(ObservationCreateComponent, {
        remove: { imports: [SelectSpeciesComponent, SelectDateTimeComponent, ReadWriteMapComponent] },
        add: { imports: [MockComponent(SelectSpeciesComponent), MockComponent(SelectDateTimeComponent), MockComponent(ReadWriteMapComponent)] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ObservationCreateComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    // ............... put this in test helper ..........................................
    const birdSummaryObject: IBirdSummary =
    {
      birdId: 1002,
      species: "Stercorarius parasiticus",
      englishName: "Arctic Skua",
      populationSize: "1,000 - 10,000 Pairs",
      btoStatusInBritain: "Migrant Breeder, Passage Visitor",
      thumbnailUrl: null,
      conservationStatus: "Red",
      conservationListColourCode: "Red",
      birderStatus: "Common"
    };

    component.selectSpeciesForm = new FormGroup({
      bird: new FormControl(birdSummaryObject, Validators.compose([
        Validators.required,
        BirdsListValidator()
      ]))
    });

    fixture.detectChanges();
  };


  it('SMOKE TEST: should be created', fakeAsync(async () => {
    await setup();
    expect(component).toBeTruthy();
  }));

  // describe('STEPPER CONTROL TESTS', () => { 

  // });




  describe('initial form setup (form invalid)', () => {

    it('should show invalid form message', async () => {
      await setup();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="invalid-form-msg"]')?.textContent).toBeTruthy();
    });

    it('should show invalid form back button', async () => {
      await setup();

      const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#back-form-invalid' }));
      expect(await btn.getText()).toBe('Back');
      expect(btn).toBeTruthy();
    });

    it('should load quantity input with correct setup', async () => {
      await setup();
      const input = await loader.getHarness(MatInputHarness.with({ selector: '#quantity' }));
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
      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#quantity' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      expect(await formField.getTextErrors()).toEqual(['This field is required.']);

      fixture.componentInstance.addObservationForm.get('quantity')?.setValue('');
      expect(await formField.isControlValid()).toBe(false);
    });

    it('should show quantity MINIMUM validation messages when 0', async () => {
      await setup();
      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#quantity' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      // expect(await formField.getTextErrors()).toEqual(['This field is required.']);

      fixture.componentInstance.addObservationForm.get('quantity')?.setValue('0');
      expect(await formField.getTextErrors()).toEqual(['The minimum value is 1 individual.']);
      expect(await formField.isControlValid()).toBe(false);
    });

    it('should show quantity MAXIMUM validation message when > 1000', async () => {
      await setup();
      const formField = await loader.getHarness(MatFormFieldHarness.with({ selector: '#quantity' }));
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
      expect(await formField.getTextErrors()).toEqual([]);

      await ((await formField.getControl()) as MatInputHarness)?.blur();
      // expect(await formField.getTextErrors()).toEqual(['This field is required.']);

      fixture.componentInstance.addObservationForm.get('quantity')?.setValue('1001');
      expect(await formField.getTextErrors()).toEqual(['The maximum value is 1000 individuals.']);
      expect(await formField.isControlValid()).toBe(false);
    });

  });

  describe('SUBMITTING A VALID FORM', () => {

    // beforeEach(() => MockInstance(ReadWriteMapComponent, '_mapComponent', jasmine.createSpy()));

    it('should render the valid form section when form is valid', async () => {
      await setup();

      // const controls = component.selectSpeciesForm.controls;
      // for (const control in controls) {
      //   // Clear sync validators - use clearAsyncValidators() for async
      //   // validators
      //   controls[control].clearValidators();
      //   // should update just the control and not everything
      //   controls[control].updateValueAndValidity({ onlySelf: true });
      // }
      // component.selectSpeciesForm.updateValueAndValidity();
      const birdSummaryObject: IBirdSummary =
      {
        birdId: 1002,
        species: "Stercorarius parasiticus",
        englishName: "Arctic Skua",
        populationSize: "1,000 - 10,000 Pairs",
        btoStatusInBritain: "Migrant Breeder, Passage Visitor",
        thumbnailUrl: null,
        conservationStatus: "Red",
        conservationListColourCode: "Red",
        birderStatus: "Common"
      };
      fixture.componentInstance.selectSpeciesForm.get('bird')?.setValue(birdSummaryObject);

      fixture.componentInstance.addObservationForm.get('quantity')?.setValue('1');

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="valid-form-section"]')).toBeTruthy();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Save' }));
      expect(await submitBtn.isDisabled()).toBe(false);
      expect(await submitBtn.getText()).toBe('Save');

      const resetBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Reset' }));
      expect(await resetBtn.isDisabled()).toBe(false);
      expect(await resetBtn.getText()).toBe('Reset');
    });

    it('should submit the valid form and call the service', async () => {
      await setup();

      const birdSummaryObject: IBirdSummary =
      {
        birdId: 1002,
        species: "Stercorarius parasiticus",
        englishName: "Arctic Skua",
        populationSize: "1,000 - 10,000 Pairs",
        btoStatusInBritain: "Migrant Breeder, Passage Visitor",
        thumbnailUrl: null,
        conservationStatus: "Red",
        conservationListColourCode: "Red",
        birderStatus: "Common"
      };
      fixture.componentInstance.selectSpeciesForm.get('bird')?.setValue(birdSummaryObject);

      fixture.componentInstance.addObservationForm.get('quantity')?.setValue('1');

      // fixture.detectChanges();



      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Save' }));

      await submitBtn.click();

      expect(fakeObservationCrudService.addObservation).toHaveBeenCalledTimes(1);
      // expect(fakeObservationCrudService.addObservation).toHaveBeenCalledWith(contactFormModel);
    });







    it('PPPPPPPPPPPPPPPPPPPPPPPPPP', async () => {
      await setup();

      const input = await loader.getHarness(MatInputHarness.with({ selector: '#quantity' }));

      expect(await input.getValue()).toBe('');
      await input.setValue('1');

      expect(await input.getValue()).toBe('1');

      const controls = component.selectSpeciesForm.controls;
      for (const control in controls) {
        // Clear sync validators - use clearAsyncValidators() for async
        // validators
        controls[control].clearValidators();
        // should update just the control and not everything
        controls[control].updateValueAndValidity({ onlySelf: true });
      }
      component.selectSpeciesForm.updateValueAndValidity();

      // fixture.detectChanges();

      const submitBtn = await loader.getHarness(MatButtonHarness.with({ text: 'Save' }));
      expect(await submitBtn.isDisabled()).toBe(false);
      expect(await submitBtn.getText()).toBe('Save');
    });

  })

});
