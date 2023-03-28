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

const r: readonly IBirdSummary[] = birdSummaryObject;

describe('SelectSpeciesComponent', () => {
  let component: SelectSpeciesComponent;
  let fixture: ComponentFixture<SelectSpeciesComponent>;

  let fakeSelectSpeciesService: jasmine.SpyObj<SelectSpeciesService>;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<SelectSpeciesService>) => {

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
      imports: [FormsModule, HttpClientTestingModule, NgbModule, FormsModule, ReactiveFormsModule],
      declarations: [SelectSpeciesComponent],
      providers: [{ provide: SelectSpeciesService, useValue: fakeSelectSpeciesService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectSpeciesComponent);
    component = fixture.componentInstance;

    component.selectSpeciesForm = new FormGroup({
      bird: new FormControl('', Validators.compose([
        Validators.required,
        BirdsListValidator()
      ]))
    });

    spyOn(component, 'reload');

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

    it('should show the loading symbol', fakeAsync(async () => {
      await setup();
      expect(findEl(fixture, 'loading')).toBeDefined();
    }));
  });


  describe('when error fetching the data', () => {

    it('should create', fakeAsync(async () => {
      await setup({ isError: of(true) });
      expect(findEl(fixture, 'loading')).toBeDefined();
      expect(findEl(fixture, 'error')).toBeDefined();
    }));

    it('should request data again on request', fakeAsync(async () => {
      await setup({ isError: of(true) });
      expect(findEl(fixture, 'reload-button')).toBeDefined();

      //fixture.debugElement.query(By.css('.alert-link')).triggerEventHandler('click', null);
      // with test helper...
      click(fixture, 'reload-button');

      // one on compile, then again on request
      expect(component.reload).toHaveBeenCalledTimes(1);
      expect(fakeSelectSpeciesService.getData).toHaveBeenCalledTimes(1);
    }));

    it('should request data again on request (2)', fakeAsync(async () => {
      await setup({ isError: of(true) });
      expect(findEl(fixture, 'reload-button')).toBeDefined();

      fixture.debugElement.query(By.css('.alert-link')).triggerEventHandler('click', null);
      // with test helper...
      //click(fixture, 'reload-button');

      // one on compile, then again on request
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
      expect(compiled.querySelector('[data-testid="loading"]')?.textContent).toBeUndefined();
    }));

    it('should call spy on city search', fakeAsync(() => {
      const spy = spyOn(component, 'search').and.returnValue(of(r));

      let inputTextArray = ['', 'A', 'Ar', 'Arc', 'Arct', 'Arctic'];
      let textMock$: Observable<string> = interval(100).pipe(take(7), map(index => inputTextArray[index]));

      component.search(textMock$).subscribe(x => {
        expect(x).toEqual(x);
      });

      tick(1000);

      expect(spy).toHaveBeenCalled();
    }));

    it('marks fields as required and shows the error message', fakeAsync(async () => {
      await setup({
        isError: of(false),
        getBirds: BirdsDddlResponse
      });

      //setFieldValue(fixture, 'bird', 'Arctic');

      markFieldAsTouched(findEl(fixture, 'bird'));

      fixture.detectChanges();

      tick(1000);

      const el = findEl(fixture, 'bird');

      expect(el.attributes['aria-required']).toEqual(
        'true',
        `bird must be marked as aria-required`
      );

      expect(el.attributes['required']).toEqual(
        '',
        `bird must be marked as required`
      );

      expect('ng-invalid' in el.classes).toBe(true);

      expectText(fixture, 'error-req', 'This field is required.');
    }));


    it('marks field invalid if object not selected from input, and shows the error message', fakeAsync(async () => {
      await setup({
        isError: of(false),
        getBirds: BirdsDddlResponse
      });

      setFieldValue(fixture, 'bird', 'Arctic');

      //markFieldAsTouched(findEl(fixture, 'bird'));

      fixture.detectChanges();

      tick(1000);

      const el = findEl(fixture, 'bird');

      // // ng-invalid class is set by Angular itself on invalid form fields 
      expectText(fixture, 'error-obj', 'You must select a bird species from the list.');
    }));
  });

  const markFieldAsTouched = (element: DebugElement) => {
    dispatchFakeEvent(element.nativeElement, 'blur');
  };
});