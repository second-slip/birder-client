import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { BirdsDddlResponse } from 'src/app/testing/birds-helpers';
import { click, findEl, setFieldElementValue, setFieldValue } from 'src/app/testing/element.spec-helper';
import { BirdsListValidator } from 'src/app/_validators';

import { SelectSpeciesComponent } from './select-species.component';
import { SelectSpeciesService } from './select-species.service';

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
    //spyOn(component, 'search');

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
  });

  describe('when data are fetched successfully', () => {

    it('does not show loading symbol', fakeAsync(async () => {
      await setup({
        isError: of(false),
        getBirds: BirdsDddlResponse
      });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
      expect(compiled.querySelector('[data-testid="loading"]')?.textContent).toBeUndefined();
    }));

    //   it('does not show loading symbol', fakeAsync(async () => {
    //     await setup({
    //       isError: of(false),
    //       getBirds: BirdsDddlResponse
    //     });

    //     let y =[
    //       {
    //         "birdId": 1002,
    //         "species": "Stercorarius parasiticus",
    //         "englishName": "Arctic Skua",
    //         "populationSize": "1,000 - 10,000 Pairs",
    //         "btoStatusInBritain": "Migrant Breeder, Passage Visitor",
    //         "thumbnailUrl": null,
    //         "conservationStatus": "Red",
    //         "conservationListColourCode": "Red",
    //         "birderStatus": "Common"
    //       }];


    //     setFieldValue(fixture, 'bird', 'Arctic');

    //     fixture.detectChanges();
    //     tick(1000);
    //     // flush();
    //     // discardPeriodicTasks()
    //     // fixture.detectChanges();

    //     console.log(component.selectSpeciesForm);

    //     expect(component.selectSpeciesForm.value).toEqual(y);

    //     flush();

    //     discardPeriodicTasks();
    //   }));


  });
});