import { Component, input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-select-date-time',
  templateUrl: './select-date-time.component.html',
  styleUrls: ['./select-date-time.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class SelectDateTimeComponent implements OnInit {
  public form = input.required<FormGroup>();

  protected maxDate: Date;

  ngOnInit(): void {
    this._setMinMaxDateRange();
    // this.form().valueChanges.subscribe(() => { });
  }

  private _setMinMaxDateRange(): void {
    this.maxDate = new Date();
  }
}
