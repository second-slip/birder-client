import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDate, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator } from '@angular/forms';


@Component({
  selector: 'app-select-date-time',
  templateUrl: './select-date-time.component.html',
  styleUrls: ['./select-date-time.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectDateTimeComponent implements OnInit {
  @Input() dateForm: FormGroup;

  public date: NgbDate;
  public time: NgbTimeStruct;
  public minDate: NgbDateStruct;
  public maxDate: NgbDateStruct;
  public spinners = true;

  ngOnInit(): void {
    this._setInitialValue();
  }

  private _setInitialValue(): void {
    const formValue = new Date(this.dateForm.value.observationDateTime);

    this.date = new NgbDate(formValue.getFullYear(), formValue.getMonth() + 1, formValue.getDate());
    this.time = { hour: formValue.getHours(), minute: formValue.getMinutes(), second: 0 };

    const now = new Date();

    this.maxDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    }

    this.minDate =  {
      year: now.getFullYear() - 20,
      month: now.getMonth() + 1,
      day: now.getDate()
    }
  }

  public updateFormValue(): void {
    this._updateFormValue();
  }

  private _updateFormValue(): void {
    //guards
    // if null
    const newDateTime = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute);

    this.dateForm.setValue(
      {
        observationDateTime: newDateTime
      }
    );
  }

  @Input('appForbiddenName') forbiddenName = '';

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    alert(control.value);

    if (!value) {
      return null;
    }

    if (value.hour < 12) {
      return { tooEarly: true };
    }
    if (value.hour > 13) {
      return { tooLate: true };
    }

    return null;
  }
}




/** A hero's name can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    alert('');
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

@Directive({
  selector: '[appForbiddenName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true }]
})
export class ForbiddenValidatorDirective implements Validator {
  @Input('appForbiddenName') forbiddenName = '';

  validate(control: AbstractControl): ValidationErrors | null {
    alert('');
    return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
      : null;
  }
}
