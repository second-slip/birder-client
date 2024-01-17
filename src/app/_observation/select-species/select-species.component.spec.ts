// todo: better tests
/*
Ideally need to test model is valid (ng-valid) when object is selected from the typeahead
But don't want to test their code (i.e. button clicks, etc), just mine...
*/

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { interval, map, Observable, of, take } from 'rxjs';
import { BirdsDddlResponse } from 'src/app/testing/birds-helpers';
import { click, dispatchFakeEvent, expectText, findEl, setFieldValue } from 'src/app/testing/element.spec-helper';
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

const birdSummaryObject = [
    {
        "birdId": 1002,
        "species": "Stercorarius parasiticus",
        "englishName": "Arctic Skua",
        "populationSize": "1,000 - 10,000 Pairs",
        "btoStatusInBritain": "Migrant Breeder, Passage Visitor",
        "thumbnailUrl": null,
        "conservationStatus": "Red",
        "conservationListColourCode": "Red",
        "birderStatus": "Common"
    }];

// const r: readonly IBirdSummary[] = birdSummaryObject;

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

        spyOn(component, 'reload'); /// .....................?
        spyOn(component, 'filter'); /// .....................?
        spyOn(component, 'displayFn');
        // spyOnProperty(component, 'filteredBirds', 'get'); /// .....................?

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

        ////
        // it('should show the loading symbol'
        // mat -spinner
        // it('checks state while async action is in progress', async () => {
        //     const buttonHarness = loader.getHarness(MyButtonHarness);
        //     await manualChangeDetection(async () => {
        //       await buttonHarness.click();
        //       fixture.detectChanges();
        //       // Check expectations while async click operation is in progress.
        //       expect(isProgressSpinnerVisible()).toBe(true);
        //       await fixture.whenStable();
        //       // Check expectations after async click operation complete.
        //       expect(isProgressSpinnerVisible()).toBe(false);
        //     });

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

        it('should request data again on request (test without Harness)', fakeAsync(async () => {
            await setup({ isError: of(true) });
            expect(findEl(fixture, 'reload-button')).toBeDefined();

            //fixture.debugElement.query(By.css('.alert-link')).triggerEventHandler('click', null);
            // with test helper...
            click(fixture, 'reload-button');

            // one on compile, then again on request
            expect(component.reload).toHaveBeenCalledTimes(1);
            expect(fakeSelectSpeciesService.getData).toHaveBeenCalledTimes(1);
        }));

        it('should request data again on request (test with Button Harness)', fakeAsync(async () => {
            await setup({ isError: of(true) });

            const btn = await loader.getHarness(MatButtonHarness.with({ selector: '#reload' }));
            await btn.click();

            expect(component.reload).toHaveBeenCalledTimes(1);
            expect(fakeSelectSpeciesService.getData).toHaveBeenCalledTimes(1);
        }));
    });

    describe('when data are fetched successfully', () => {

        it('does not show loading symbol or error message', fakeAsync(async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
            // expect(compiled.querySelector('[data-testid="loading"]')?.textContent).toBeUndefined();
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

        //     const input = await loader.getHarness(MatAutocompleteHarness.with({ selector: '#bird'}))
        //     await input.focus();
        //     expect(await input.isFocused()).toBe(true);
        //     const options = await input.getOptions();
        //     expect(options.length).toEqual(1)
        //   });

        it('should be able to type in an input', async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const input = await loader.getHarness(MatAutocompleteHarness.with({ selector: '#bird' }));
            await input.enterText('Hello there');
            expect(await input.getValue()).toBe('Hello there');
        });



        it('YYYYYYYYYY', fakeAsync(async () => {
            await setup({
                isError: of(false),
                getBirds: BirdsDddlResponse
            });

            const input = await loader.getHarness(MatInputHarness.with({ selector: '#bird' }));

            //await input.setValue('l');

            expect(expect(component.filter).toHaveBeenCalledTimes(1))
            expect(expect(component.displayFn).toHaveBeenCalledTimes(1))
            // expect(expect(component.filteredBirds).toHaveBeenCalledTimes(1))

        }));

        // it('should call spy on city search', fakeAsync(() => {
        //   const spy = spyOn(component, 'search').and.returnValue(of(r));

        //   let inputTextArray = ['', 'A', 'Ar', 'Arc', 'Arct', 'Arctic'];
        //   let textMock$: Observable<string> = interval(100).pipe(take(7), map(index => inputTextArray[index]));

        //   component.search(textMock$).subscribe(x => {
        //     expect(x).toEqual(x);
        //   });

        //   tick(1000);

        //   expect(spy).toHaveBeenCalled();
        // }));

        // it('marks fields as required and shows the error message', fakeAsync(async () => {
        //     await setup({
        //         isError: of(false),
        //         getBirds: BirdsDddlResponse
        //     });

        //     setFieldValue(fixture, 'bird', 'Arctic');

        //     markFieldAsTouched(findEl(fixture, 'bird'));

        //     fixture.detectChanges();

        //     tick(1000);

        //     const el = findEl(fixture, 'bird');

        //     expect(el.attributes['aria-required']).toEqual(
        //         'true',
        //         `bird must be marked as aria-required`
        //     );

        //     expect(el.attributes['required']).toEqual(
        //         '',
        //         `bird must be marked as required`
        //     );

        //     expect('ng-invalid' in el.classes).toBe(true);

        //     expectText(fixture, 'error-req', 'This field is required.');
        // }));


        //     it('marks field invalid if object not selected from input, and shows the error message', fakeAsync(async () => {
        //         await setup({
        //             isError: of(false),
        //             getBirds: BirdsDddlResponse
        //         });

        //         setFieldValue(fixture, 'bird', 'Arctic');

        //         //markFieldAsTouched(findEl(fixture, 'bird'));

        //         fixture.detectChanges();

        //         tick(1000);

        //         const el = findEl(fixture, 'bird');

        //         // // ng-invalid class is set by Angular itself on invalid form fields 
        //         expectText(fixture, 'error-obj', 'You must select a bird species from the list.');
        //     }));
    });

    const markFieldAsTouched = (element: DebugElement) => {
        dispatchFakeEvent(element.nativeElement, 'blur');
    };
});