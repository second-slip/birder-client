import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SelectDateTimeComponent } from './select-date-time.component';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { click, expectText, findEl } from 'src/app/testing/element.spec-helper';

// todo: struggling to test updateFormValue method as cannot find a way to trigger the event handler...

const requiredFields = [
  'date',
  'time'
];

describe('SelectDateTimeComponent', () => {
  let component: SelectDateTimeComponent;
  let fixture: ComponentFixture<SelectDateTimeComponent>;

  const setup = async (fakeInputDate?: Date | null) => {

    await TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule, NgbModule],
      declarations: [SelectDateTimeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectDateTimeComponent);
    component = fixture.componentInstance;

    component.dateForm = new FormGroup({
      observationDateTime: new FormControl(fakeInputDate, Validators.compose([
        Validators.required
      ]))
    });

    //spyOn(component, 'reload');
    spyOn(component, 'updateFormValue');

    fixture.detectChanges();
  };

  describe('when component is loaded', () => {

    it('should create', fakeAsync(async () => {
      await setup(new Date());
      expect(component).toBeTruthy();
    }));


    describe('when form is valid', () => {

      it('fields should be marked as required', fakeAsync(async () => {
        await setup(new Date());

        requiredFields.forEach((testId) => {
          const el = findEl(fixture, testId);

          expect(el.attributes['aria-required']).toBe(
            'true',
            `${testId} must be marked as aria-required`,
          );
        });
      }));

      it('should not show error message', fakeAsync(async () => {
        await setup(new Date());

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('[data-testid="form-invalid-error-message"]')?.textContent).toBeUndefined();
      }));
    });

    describe('when form is not valid', () => {

      it('should show error message', fakeAsync(async () => {
        await setup(null);

        expectText(fixture, 'form-invalid-date-error-message', 'Pick a date using the control.');
      }));
    });

  });

  // describe('when form is not valid', () => {

  //   // it('should show error message', fakeAsync(async () => {

  //   //   // spyOn(component, 'updateFormValue');

  //   //   await setup(new Date());

  //   //   // expect(component).toBeTruthy();

  //   //   const resetInputEl = findEl(fixture, 'date').nativeElement;
  //   //   //console.log(resetInputEl);
  //   //   resetInputEl.value = '2022-08-27';

  //   //   resetInputEl.dispatchEvent(new Event('change'));


  //   //   fixture.detectChanges();

  //   //   tick(1000);

  //   //   console.log(resetInputEl.value);
  //   //   // console.log(component.date);
  //   //   // console.log(component.dateForm);

  //   //   //expectText(fixture, 'form-invalid-date-error-message', 'Choose a time using the control.');
  //   //   console.log(component.date)
  //   //   expect(component.updateFormValue).toHaveBeenCalled();
  //   //   // expectText(fixture, 'form-invalid-time-error-message', 'Choose a time using the control.');
  //   // }));

  //   it('should show error message', fakeAsync(async () => {

  //     // spyOn(component, 'updateFormValue');

  //     await setup(new Date());

  //     // expect(component).toBeTruthy();

  //     const resetInputEl = findEl(fixture, 'date').nativeElement;
  //     console.log(resetInputEl);
  //     resetInputEl.value = '2022-08-27';

  //     resetInputEl.dispatchEvent(new Event('input'));

  //     click(fixture, "date");

  //     resetInputEl.value = '2022-08-27';
  //     fixture.detectChanges();
  //     resetInputEl.value = '2022-08-27';
  //     tick(1000);

  //     console.log(resetInputEl);
  //     // console.log(component.date);
  //     // console.log(component.dateForm);

  //     //expectText(fixture, 'form-invalid-date-error-message', 'Choose a time using the control.');
  //     console.log(component.time)
  //     expect(component.updateFormValue).toHaveBeenCalled();
  //     // expectText(fixture, 'form-invalid-time-error-message', 'Choose a time using the control.');
  //   }));
  // });

});
