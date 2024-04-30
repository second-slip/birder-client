import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-select-date-time',
  templateUrl: './select-date-time.component.html',
  styleUrls: ['./select-date-time.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, CommonModule],
  providers: [provideNativeDateAdapter()]
})
export class SelectDateTimeComponent implements OnInit {
  @Input()
  dateTime: string = new Date().toISOString(); // note: not tracking formvalue as date & time are separate; combined in server model (change one day)

  @Output()
  public dateTimeValid = new EventEmitter<boolean>(true);

  public form: FormGroup;  
  public minDate: Date;
  public maxDate: Date;

  ngOnInit(): void {
    this._createForm(this.dateTime);

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date();

    this.form.valueChanges.subscribe(
      () => {
        this._updateDateTime();
        this._notify();
      }
    );
  }

  private _updateDateTime(): void {
    const date = new Date(this.form.value.observationDate);
    const time = this.form.value.observationTime;

    try {
      var dmy = time.split(":");
      date.setHours(dmy[0]);
      date.setMinutes(dmy[1]);

      this.dateTime = date.toISOString();
    }
    catch {
      this._notify();
    }
  }

  private _getTimeAsString(date: Date) {
    return `${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") +
      date.getMinutes()}`;
  }

  private _notify(): void {
    this.dateTimeValid.emit(this.form.valid);
  }

  private _createForm(dateTime: string): void {
    this.form = new FormGroup({
      observationDate: new FormControl(new Date(dateTime).toISOString(), Validators.compose([
        Validators.required
      ])),
      observationTime: new FormControl(this._getTimeAsString(new Date(dateTime)), Validators.compose([
        Validators.required,
        Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
      ]))
    });
    this._notify(); // initial value of event emitter subject
  }
}