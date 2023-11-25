import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDate, NgbDateStruct, NgbTimeStruct, NgbInputDatepicker, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

// ideally, it is better to write a proper validator
// but added complexity because the ngb controls are binded to NgbDate & NgbTimeStruct types

// todo: might be better to change to Angular Material for better testability

@Component({
    selector: 'app-select-date-time',
    templateUrl: './select-date-time.component.html',
    styleUrls: ['./select-date-time.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgbInputDatepicker, NgIf, NgbTimepicker]
})
export class SelectDateTimeComponent implements OnInit {
  @Input() dateForm: FormGroup;

  public date: NgbDate;
  public time: NgbTimeStruct;
  public minDate: NgbDateStruct;
  public maxDate: NgbDateStruct;
  public spinners = true;

  ngOnInit(): void {
    this._setInitialValues();
  }

  private _setInitialValues(): void {
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

    if (this.time == null || this.date == null)
    {
      this.dateForm.setErrors({ 'invalid': true });
      // this.dateForm.controls['observationDateTime'].setValue(null);
    }

    const newDateTime = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute);

    this.dateForm.setValue(
      {
        observationDateTime: newDateTime
      }
    );
  }
}