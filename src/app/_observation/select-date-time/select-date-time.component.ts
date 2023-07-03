import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDate, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-date-time',
  templateUrl: './select-date-time.component.html',
  styleUrls: ['./select-date-time.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectDateTimeComponent implements OnInit {
  @Input() dateForm: FormGroup;

  date: NgbDate;
  time: NgbTimeStruct;
  // public minDate = moment().subtract(20, "years");// new Date().toISOString(); // moment.Moment;
  // public maxDate = moment().format('yyyy-MM-dd 23:59:59'); // new Date().toISOString(); // moment.Moment;

  spinners = true;

  ngOnInit(): void {
    // console.log(this.dateForm);
    let y = new Date(this.dateForm.value.observationDateTime);
    // console.log(y);
    this.date = new NgbDate(y.getFullYear(), y.getMonth() + 1, y.getDate());
    this.time = { hour: y.getHours(), minute: y.getMinutes(), second: 0 };

    // this.date = new NgbDate(this.dateForm.value.observationDateTime.year(), this.dateForm.value.observationDateTime.month(), this.dateForm.value.observationDateTime.day());
    // this.time = { hour: this.dateForm.value.observationDateTime.hour(), minute: this.dateForm.value.observationDateTime.minute(), second: 0 }; 
  }

  onDateSelect(): void {
    let t = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute);

    this.dateForm.setValue(
      {
        observationDateTime: t
      }
    );
  }
}