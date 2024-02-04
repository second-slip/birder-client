import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { IObservationPosition } from 'src/app/_map/i-observation-position.dto';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { BirdsListValidator } from 'src/app/_validators';
import { ObservationCrudService } from '../observation-crud.service';
import { ICreateObservation } from './i-create-observation.dto';
import { ReadWriteMapComponent } from '../../_map/read-write-map/read-write-map.component';
import { SelectSpeciesComponent } from '../select-species/select-species.component';
import { SelectDateTimeComponent } from '../select-date-time/select-date-time.component';
import { MatStepperModule } from '@angular/material/stepper';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-observation-create',
  templateUrl: './observation-create.component.html',
  styleUrls: ['./observation-create.component.scss'],
  providers: [{ provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe, MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule,
    ReadWriteMapComponent, SelectDateTimeComponent, SelectSpeciesComponent]
})
export class ObservationCreateComponent implements OnInit {
  private _subscription = new Subject();
  public requesting: boolean;
  public selectSpeciesForm: FormGroup;
  public addObservationForm: FormGroup;
  public isDateTimeValid: boolean;
  public error = false;

  @ViewChild(ReadWriteMapComponent)
  private _mapComponent: ReadWriteMapComponent;

  @ViewChild(SelectDateTimeComponent)
  private _dateComponent: SelectDateTimeComponent;

  // @ViewChild(AddNotesComponent)
  // private _notesComponent: AddNotesComponent;

  public handleFormChange(dateTimeValid: boolean): void {
    // console.log('countChange event from CounterComponent', dateTimeValid);
    this.isDateTimeValid = dateTimeValid;
  }

  constructor(private readonly _router: Router
    , private readonly _formBuilder: FormBuilder
    , private readonly _service: ObservationCrudService
    , private readonly _announcement: AnnounceChangesService
    , readonly _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._createForms();
  }

  public onSubmit(): void {
    this.requesting = true;

    const model = this._mapToModel();
    // console.log('~~~~~~~~~~~~~~~');
    // console.log(this._dateComponent.dateTime);
    // console.log(this._dateComponent.isValid);

    this._service.addObservation(model)
      .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this._announcement.announceObservationsChanged();
          this._router.navigate([`/observation/detail/${r.observationId}`]);
        },
        error: (e) => { this.error = true; }
      });
  }

  public isFormValid(): boolean {
    // console.log('########## ' + this._dateComponent.isValid);
    // console.log(this._dateComponent.dateTime);
    return (this.addObservationForm.valid && this.selectSpeciesForm.valid && this.isDateTimeValid)
  }

  private _mapToModel(): ICreateObservation {
    const quantity = <Number>(this.addObservationForm.value.quantity);
    const dateTime = <Date>(new Date(this._dateComponent.dateTime));
    const selectedBird = <IBirdSummary>(this.selectSpeciesForm.value.bird);
    const position = <IObservationPosition>{
      latitude: this._mapComponent.latitude,
      longitude: this._mapComponent.longitude,
      formattedAddress: this._mapComponent.formattedAddress,
      shortAddress: this._mapComponent.shortAddress
    };
    // console.log(position);
    // const notes: IObservationNote[] = this._notesComponent.notes.map(note => (
    //   { // One can also get the updated notes from this.obervation (object is passed by reference to notes child component)
    //     id: 0,
    //     noteType: note.noteType, //   ObservationNoteType[note.noteType as keyof typeof ObservationNoteType],
    //     note: note.note
    //   }));

    const observation = <ICreateObservation>{
      quantity: quantity,
      observationDateTime: dateTime,
      bird: selectedBird,
      position: position,
      // notes: notes,
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
      quantity: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ]))
    });
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}