import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BirdsDdlResponse } from 'src/app/testing/birds-helpers';
import { findEl } from 'src/app/testing/element.spec-helper';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { BirdsListValidator } from 'src/app/_validators';
import { SelectSpeciesComponent } from './select-species.component';
import { SelectSpeciesService } from './select-species.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('SelectSpeciesComponent', () => {
  let component: SelectSpeciesComponent;
  let loader: HarnessLoader;
  let fixture: ComponentFixture<SelectSpeciesComponent>;

  let fakeSelectSpeciesService: jasmine.SpyObj<SelectSpeciesService>;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<SelectSpeciesService>
  ) => {
    fakeSelectSpeciesService = jasmine.createSpyObj<SelectSpeciesService>(
      'SelectSpeciesService',
      {
        retry: undefined,
      },
      {
        error: signal(false),
        birds: signal([]),
        ...fakePropertyValues,
      }
    );

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: SelectSpeciesService, useValue: fakeSelectSpeciesService },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSpeciesComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    component.selectSpeciesForm = new FormGroup({
      bird: new FormControl(
        '',
        Validators.compose([Validators.required, BirdsListValidator()])
      ),
    });

    fixture.detectChanges();
  };

  describe('when component is loaded', () => {
    it('should create', async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    it('should load progress spinner when data source is empty (loading)', async () => {
      await setup({
        birds: signal([]),
      });

      const loading = await loader.getHarness(
        MatProgressSpinnerHarness.with({ selector: '.loading-spinner' })
      );
      expect(loading).toBeDefined();

      const progressSpinners = await loader.getAllHarnesses(
        MatProgressSpinnerHarness
      );
      expect(progressSpinners.length).toBe(1);
    });
  });

  describe('when error fetching the data', () => {
    it('should render the error template content', async () => {
      await setup({ error: signal(true) });
      expect(findEl(fixture, 'error')).toBeDefined();
    });

    it('should show the error message', async () => {
      await setup({ error: signal(true) });
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error-message"]')?.textContent
      ).toContain('There was a problem retrieving the birds species list');
    });

    it('should render the Reload button', async () => {
      await setup({ error: signal(true) });
      const btn = await loader.getHarness(
        MatButtonHarness.with({ selector: '#reload' })
      );
      expect(await btn.isDisabled()).toBe(false);
      expect(await btn.getText()).toContain('Reload');
    });

    it('should request data again on request (test with Button Harness)', async () => {
      await setup({ error: signal(true) });

      const btn = await loader.getHarness(
        MatButtonHarness.with({ selector: '#reload' })
      );
      await btn.click();

      expect(fakeSelectSpeciesService.retry).toHaveBeenCalledTimes(1);
    });
  });

  describe('when data are fetched successfully', () => {
    it('does not show error content', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('[data-testid="error"]')?.textContent
      ).toBeUndefined();
    });

    it('Should load input with correct setup', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#bird' })
      );
      expect(await input.isRequired()).toBe(true);
      expect(await input.getType()).toBe('text');
      expect(await input.isDisabled()).toBe(false);
      expect(await input.getValue()).toBe('');
    });

    it('should not show loading spinner when data are loaded', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const progressSpinners = await loader.getAllHarnesses(
        MatProgressSpinnerHarness
      );
      expect(progressSpinners.length).toBe(0);
    });

    it('autocomplete should focus and blur an input', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const input = await loader.getHarness(
        MatAutocompleteHarness.with({ selector: '#bird' })
      );
      expect(await input.isFocused()).toBe(false);
      await input.focus();
      expect(await input.isFocused()).toBe(true);
      await input.blur();
      expect(await input.isFocused()).toBe(false);
    });

    it('should be able to get ALL filtered options', async () => {
      // async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const input = await loader.getHarness(
        MatAutocompleteHarness.with({ selector: '#bird' })
      );
      await input.focus();
      const options = await input.getOptions();

      expect(options.length).toBe(40);
    });

    it('filter should return one option when appropriate', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const input = await loader.getHarness(
        MatAutocompleteHarness.with({ selector: '#bird' })
      );
      await input.focus();
      const options = await input.getOptions({ text: /Blue/ });
      await input.focus();

      expect(options.length).toBe(1);
      expect(await options[0].getText()).toBe('Blue Tit');
    });

    it('filter should return multiple options when appropriate', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const input = await loader.getHarness(
        MatAutocompleteHarness.with({ selector: '#bird' })
      );
      await input.focus();
      const options = await input.getOptions({ text: /Barn/ });

      expect(options.length).toBe(2);
      expect(await options[0].getText()).toBe('Barn Owl');
      expect(await options[1].getText()).toBe('Barnacle Goose');
    });

    it('should be able to select option', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const birdSummaryObject: IBirdSummary = {
        birdId: 1002,
        species: 'Stercorarius parasiticus',
        englishName: 'Arctic Skua',
        populationSize: '1,000 - 10,000 Pairs',
        btoStatusInBritain: 'Migrant Breeder, Passage Visitor',
        thumbnailUrl: null,
        conservationStatus: 'Red',
        conservationListColourCode: 'Red',
        birderStatus: 'Common',
      };

      const input = await loader.getHarness(
        MatAutocompleteHarness.with({ selector: '#bird' })
      );
      await input.selectOption({ text: 'Arctic Skua' });
      expect(await input.getValue()).toBe(birdSummaryObject.englishName);
    });

    it('should be able to type in an input', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '#bird' })
      );
      await input.setValue('Hello');
      expect(await input.getValue()).toBe('Hello');
    });

    it('should be able to one form field', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
      expect(formFields.length).toBe(1);
    });

    it('should be able to get control of form-field', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const formField = await loader.getHarness(MatFormFieldHarness);
      expect((await formField.getControl()) instanceof MatInputHarness).toBe(
        true
      );
    });

    it('should be able to get error messages and hints of form-field', async () => {
      await setup({
        birds: signal(BirdsDdlResponse),
      });

      const formField = await loader.getHarness(MatFormFieldHarness);
      expect(await formField.getTextErrors()).toEqual([]);
      expect(await formField.getTextHints()).toEqual([
        'Type to filter species list',
      ]);

      // fixture.componentInstance.requiredControl.setValue('');
      await ((await formField.getControl()) as MatInputHarness)?.blur();
      expect(await formField.getTextErrors()).toEqual(['Species is required']);
      expect(await formField.getTextHints()).toEqual([]);
    });

    describe('display function tests', () => {
      it('should return englishName from BirdSummary object', async () => {
        await setup({
          birds: signal(BirdsDdlResponse),
        });

        const birdSummaryObject: IBirdSummary = {
          birdId: 1002,
          species: 'Stercorarius parasiticus',
          englishName: 'Arctic Skua',
          populationSize: '1,000 - 10,000 Pairs',
          btoStatusInBritain: 'Migrant Breeder, Passage Visitor',
          thumbnailUrl: null,
          conservationStatus: 'Red',
          conservationListColourCode: 'Red',
          birderStatus: 'Common',
        };

        let actual = fixture.componentInstance.displayFn(birdSummaryObject);

        expect(actual).toBe(birdSummaryObject.englishName);
      });
    });
  });
});
