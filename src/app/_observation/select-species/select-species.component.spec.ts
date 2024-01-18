import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { BirdsDddlResponse } from 'src/app/testing/birds-helpers';
import { findEl } from 'src/app/testing/element.spec-helper';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { BirdsListValidator } from 'src/app/_validators';
import { SelectSpeciesComponent } from './select-species.component';
import { SelectSpeciesService } from './select-species.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing'
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';

describe('SelectSpeciesComponent', () => {
    let component: SelectSpeciesComponent;
    let loader: HarnessLoader;
    let fixture: ComponentFixture<SelectSpeciesComponent>;

    let fakeSelectSpeciesService: jasmine.SpyObj<SelectSpeciesService>;

    const setup = async (fakePropertyValues?: jasmine.SpyObjPropertyNames<SelectSpeciesService>) => {

        fakeSelectSpeciesService = jasmine.createSpyObj<SelectSpeciesService>(
            'SelectSpeciesService',
            {
                getData: undefined
            },
            {
                isError: of(false),
                getBirds: [],
                ...fakePropertyValues
            }
        );

        await TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule, NgbModule, FormsModule, ReactiveFormsModule, SelectSpeciesComponent],
            providers: [{ provide: SelectSpeciesService, useValue: fakeSelectSpeciesService },
            provideAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(SelectSpeciesComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);

        component.selectSpeciesForm = new FormGroup({
            bird: new FormControl('', Validators.compose([
                Validators.required,
                BirdsListValidator()
            ]))
        });

        fixture.detectChanges();
    };

    describe('when component is loaded', () => {

        it('should create', fakeAsync(async () => {
            await setup();
            expect(component).toBeTruthy();
        }));

        it('should call the data fetch method', fakeAsync(async () => {
            await setup();
            expect(fakeSelectSpeciesService.getData).toHaveBeenCalledTimes(1);
        }));

        it('should load progress spinner when data source is empty (loading)', async () => {
            await setup({
                isError: of(false),
                getBirds: []
            });

            const loading = await loader.getHarness(MatProgressSpinnerHarness.with({ selector: '.loading-spinner' }));
            expect(loading).toBeDefined();

            const progressSpinners = await loader.getAllHarnesses(MatProgressSpinnerHarness);
            expect(progressSpinners.length).toBe(1);
        });
    });


    describe('when error fetching the data', () => {

        it('should render the error template content', fakeAsync(async () => {
            await setup({ isError: of(true) });
            expect(findEl(fixture, 'error')).toBeDefined();
        }));

        it('should show the error message', fakeAsync(async () => {
            await setup({ isError: of(true) });
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="error-message"]')?.textContent).toBe('There was a problem retrieving the birds species list.');
        }));

        it('should render the Reload button', async () => {
            await setup({ isError: of(true) });
            const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#reload' }));
            expect(await btn.isDisabled()).toBe(false);
            expect(await btn.getText()).toContain('Reload');
        });

        it('should request data again on request (test with Button Harness)', fakeAsync(async () => {
            await setup({ isError: of(true) });

            expect(fakeSelectSpeciesService.getData).toHaveBeenCalledTimes(1);

            const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#reload' }));
            await btn.click();

            expect(fakeSelectSpeciesService.getData).toHaveBeenCalledTimes(2);
        }));
    });

    describe('when data are fetched successfully', () => {

        it('does not show error content', fakeAsync(async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
        }));

        it('Should load input with correct setup', fakeAsync(async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const input = await loader.getHarness(MatInputHarness.with({ selector: '#bird' }));
            expect(await input.isRequired()).toBe(true);
            expect(await input.getType()).toBe('text');
            expect(await input.isDisabled()).toBe(false);
            expect(await input.getValue()).toBe('');

        }));

        it('should not show loading spinner when data are loaded', fakeAsync(async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const progressSpinners = await loader.getAllHarnesses(MatProgressSpinnerHarness);
            expect(progressSpinners.length).toBe(0);
        }));

        it('autocomplete should focus and blur an input', async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const input = await loader.getHarness(MatAutocompleteHarness.with({ selector: '#bird' }));
            expect(await input.isFocused()).toBe(false);
            await input.focus();
            expect(await input.isFocused()).toBe(true);
            await input.blur();
            expect(await input.isFocused()).toBe(false);
        });

        it('should be able to get ALL filtered options', fakeAsync(async () => { // async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const input = await loader.getHarness(MatAutocompleteHarness.with({ selector: '#bird' }));
            await input.focus();
            const options = await input.getOptions();

            expect(options.length).toBe(40);
            // expect(await options[0].getText()).toBe('New York');
        }));


        // it('should be able to get filtered options', async () => {
        //     await setup({
        //         isError: of(false),
        //         getBirds: BirdsDddlResponse
        //     });

        //     const input = await loader.getHarness(MatAutocompleteHarness.with({ selector: '#bird' }));
        //     await input.focus();
        //     const options = await input.getOptions();

        //     expect(options.length).toBe(1);
        //     expect(await options[0].getText()).toBe('New York');
        // });

        // it('should be able to get filtered options 2', async () => {
        //     await setup({
        //         isError: of(false),
        //         getBirds: BirdsDddlResponse
        //     });

        //     const input = await loader.getHarness(MatAutocompleteHarness.with({ selector: '#bird' }))
        //     // const input = await loader.getHarness(MatAutocompleteHarness.with({ selector: '#bird'}))
        //     await input.focus();
        //     fixture.detectChanges();
        //     await input.enterText('i')
        //     fixture.detectChanges();
        //     expect(await input.isFocused()).toBe(true);
        //     fixture.detectChanges();
        //     const options = await input.getOptions();
        //     fixture.detectChanges();
        //     expect(options.length).toEqual(1)
        // });

        it('should be able to type in an input', async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const input = await loader.getHarness(MatInputHarness.with({ selector: '#bird' }));
            await input.setValue('Hello');
            expect(await input.getValue()).toBe('Hello');
        });

        it('should be able to one form field', async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
            expect(formFields.length).toBe(1);
        });

        it('should be able to get control of form-field', async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const formField = await loader.getHarness(MatFormFieldHarness);
            expect((await formField.getControl()) instanceof MatInputHarness).toBe(true);
        });

        it('should be able to get error messages and hints of form-field', async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const formField = await loader.getHarness(MatFormFieldHarness);
            expect(await formField.getTextErrors()).toEqual([]);
            expect(await formField.getTextHints()).toEqual(['Type to filter species list']);

            // fixture.componentInstance.requiredControl.setValue('');
            await ((await formField.getControl()) as MatInputHarness)?.blur();
            expect(await formField.getTextErrors()).toEqual(['Species is required']);
            expect(await formField.getTextHints()).toEqual([]);
        });

        //   it('should be able to check if form field is invalid', async () => {
        //     await setup({
        //         isError: of(false),
        //         getBirds: BirdsDddlResponse
        //     });

        //     const formField = await loader.getHarness(MatFormFieldHarness);
        //     expect(await formField.isControlValid()).toBe(true);

        //     await ((await formField.getControl()) as MatInputHarness)?.setValue(' ');//.blur();

        //     // fixture.componentInstance.requiredControl.setValue('');
        //     // const input = await loader.getHarness(MatInputHarness.with({ selector: '#bird' }));
        //     // expect(await input.isFocused()).toBe(false);
        //     // await input.focus();
        //     // expect(await input.isFocused()).toBe(true);

        //     // await input.setValue(' ');
        //     // fixture.detectChanges();
        //     fixture.componentInstance.selectSpeciesForm.get('bird')?.setValue('');

        //     fixture.detectChanges();

        //     expect(await formField.isControlValid()).toBe(false);
        //   });


        describe('display function tests', () => {

            it('should return englishName from BirdSummary object', fakeAsync(async () => {
                await setup({
                    isError: of(false),
                    getBirds: BirdsDddlResponse
                });

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

                let actual = fixture.componentInstance.displayFn(birdSummaryObject);

                expect(actual).toBe(birdSummaryObject.englishName);
            }));
        });
    });
});