import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment'; // replace moment with alternative
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { IObservationPosition } from 'src/app/_map/i-observation-position.dto';
import { ReadWriteMapComponent } from 'src/app/_map/read-write-map/read-write-map.component';
import { AddNotesComponent } from 'src/app/_observationNotes/add-notes/add-notes.component';
import { IObservationNote } from 'src/app/_observationNotes/i-observation-note.dto';
import { ObservationNoteType } from 'src/app/_observationNotes/observation-note-type';
import { BirdsListValidator } from 'src/app/_validators';
import { ICreateObservation } from './i-create-observation.dto';

@Component({
  selector: 'app-observation-create',
  templateUrl: './observation-create.component.html',
  styleUrls: ['./observation-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationCreateComponent implements OnInit {
  public requesting: boolean;
  public selectSpeciesForm: FormGroup;
  public addObservationForm: FormGroup;

  @ViewChild(ReadWriteMapComponent)
  private _mapComponent: ReadWriteMapComponent;

  @ViewChild(AddNotesComponent)
  private _notesComponent: AddNotesComponent;

  @ViewChild('picker') picker: any;
  public minDate = moment().subtract(20, "years");// new Date().toISOString(); // moment.Moment;
  public maxDate = moment().format('yyyy-MM-dd 23:59:59'); // new Date().toISOString(); // moment.Moment;
  public color: ThemePalette = 'primary';

  constructor(private _formBuilder: FormBuilder
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._createForms();
  }

  public onSubmit(): void {

    try {

      const model = this._mapToModel();
 
      console.log(model);




    } catch (error) {
      console.log(error);
    }
  }

  private _mapToModel(): ICreateObservation {

    const quantity = <Number>(this.addObservationForm.value.quantity);
    const dateTime = <Date>(new Date(this.addObservationForm.value.observationDateTime));
    const selectedBird = <IBirdSummary>(this.selectSpeciesForm.value);
    const position = <IObservationPosition>{
      latitude: this._mapComponent.latitude,
      longitude: this._mapComponent.longitude,
      formattedAddress: this._mapComponent.formattedAddress,
      shortAddress: this._mapComponent.shortAddress
    };
    const notes: IObservationNote[] = this._notesComponent.notes.map(note => (
      {
      id: 0,
      noteType: ObservationNoteType[note.noteType as keyof typeof ObservationNoteType],
      note: note.note
    }));

    const observation = <ICreateObservation>{
      quantity: quantity,
      observationDateTime: dateTime,
      bird: selectedBird,
      position: position,
      notes: notes,
    }

    return observation;
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

  // This functionality needs to be refactored
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
