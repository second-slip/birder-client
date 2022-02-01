import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment'; // replace moment with alternative
import { BirdsListValidator } from 'src/app/_validators';
import { SelectSpeciesComponent } from '../select-species/select-species.component';

@Component({
  selector: 'app-observation-create',
  templateUrl: './observation-create.component.html',
  styleUrls: ['./observation-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationCreateComponent implements OnInit {

  public requesting: boolean;
  public addObservationForm: FormGroup;
  public selectSpeciesForm: FormGroup;
  @ViewChild(SelectSpeciesComponent)
  private _selectSpeciesComponent: SelectSpeciesComponent;

  @ViewChild('picker') picker: any;
  public minDate = moment().subtract(20, "years");// new Date().toISOString(); // moment.Moment;
  public maxDate = moment().format('yyyy-MM-dd 23:59:59'); // new Date().toISOString(); // moment.Moment;
  public color: ThemePalette = 'primary';

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this._createForms();
  }


  public onSubmit(formValue: any): void { //ObservationViewModel
    console.log(formValue);
    console.log(this._selectSpeciesComponent.selectSpeciesForm.value);
    console.log(this._selectSpeciesComponent.selectSpeciesForm.valid);
  }

  private _createForms(): void {
    this.selectSpeciesForm = this._formBuilder.group({
      bird: new FormControl('', Validators.compose([
        Validators.required,
        BirdsListValidator()
      ]))
    });
    
    this.addObservationForm = this._formBuilder.group({
      quantity: new FormControl(1, Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ])),
      observationDateTime: new FormControl((moment()), Validators.compose([
        Validators.required
      ])),
    });
  }

  public onStepperSelectionChange() {
    this._scrollToSectionHook();
  }

  private _scrollToSectionHook() {
    const element = document.querySelector('.stepperTop0');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth', block: 'start', inline:
            'nearest'
        });
      }, 250);
    }
  }
}
