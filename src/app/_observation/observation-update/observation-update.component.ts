import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment'; //ToDo: replace moment
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_auth/authentication.service';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { IObservationPosition } from 'src/app/_map/i-observation-position.dto';
import { ReadWriteMapComponent } from 'src/app/_map/read-write-map/read-write-map.component';
import { EditNotesComponent } from 'src/app/_observation-note/edit-notes/edit-notes.component';
import { IObservationNote } from 'src/app/_observation-note/i-observation-note.dto';
import { AnnounceChangesService } from 'src/app/_sharedServices/announce-changes.service';
import { NavigationService } from 'src/app/_sharedServices/navigation.service';
import { BirdsListValidator } from 'src/app/_validators';
import { IObservation } from '../i-observation.dto';
import { ObservationCrudService } from '../observation-crud.service';
import { IUpdateObservation } from './i-update-observation.dto';

@Component({
  selector: 'app-observation-update',
  templateUrl: './observation-update.component.html',
  styleUrls: ['./observation-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationUpdateComponent implements OnInit, OnDestroy {
  private _observationId: string;
  private _subscription = new Subject();
  public requesting: boolean;
  public observation: IObservation
  public selectSpeciesForm: FormGroup;
  public updateObservationForm: FormGroup;
  public errorObject: any = null;

  @ViewChild(ReadWriteMapComponent)
  private _mapComponent: ReadWriteMapComponent;

  @ViewChild(EditNotesComponent)
  private _notesComponent: EditNotesComponent;

  @ViewChild('picker') picker: any;
  public minDate = moment().subtract(20, "years");// new Date().toISOString(); // moment.Moment;
  public maxDate = moment().format('yyyy-MM-dd 23:59:59'); // new Date().toISOString(); // moment.Moment;
  public color: ThemePalette = 'primary';

  constructor(readonly _authService: AuthenticationService
    , private readonly _router: Router
    , private readonly _route: ActivatedRoute
    , private readonly _navigation: NavigationService
    , private readonly _announcement: AnnounceChangesService
    , private readonly _observationCrudService: ObservationCrudService
    , private readonly _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this._getData(pmap.get('id'));
    });
  }

  private _getData(id: string | null): void {
    if (id) {
      this._observationId = id;
      this._getObservation();
    }
    else {
      this._redirect();
    }
  }

  public reload(): void {
    if (this._observationId) {
      this._getData(this._observationId);
    } else {
      this._redirect();
    }
  }

  private _getObservation(): void {

    this._observationCrudService.getObservation(this._observationId)
      .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: (r) => {
          this._createForms(r);
          this.observation = r;
        },
        error: (e) => { this._redirect(); }
      });
  }

  private _createForms(observation: IObservation): void {
    try {
      this.selectSpeciesForm = this._formBuilder.group({
        bird: new FormControl(observation.bird, Validators.compose([
          Validators.required,
          BirdsListValidator()
        ]))
      });

      this.updateObservationForm = this._formBuilder.group({
        observationId: new FormControl(observation.observationId),
        quantity: new FormControl(observation.quantity, Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(1000)
        ])),
        observationDateTime: new FormControl(observation.observationDateTime, Validators.compose([
          Validators.required
        ])),
      });
    }
    catch (e) { }
  }

  public onSubmit(): void {
    this.requesting = true;

    try {

      const model = this._mapToModel();
      // console.log(model);
      // console.log(this.observation);

      this._observationCrudService.updateObservation(this._observationId, model)
        .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
        .subscribe({
          next: (r) => {
            this._announcement.announceObservationsChanged();
            this._router.navigate([`/observation/detail/${r.observationId}`]); // + r.observationId.toString()]);
          },
          error: (e) => { this.errorObject = e; }
        });
    }
    catch (e) { }
  }

  private _mapToModel(): IUpdateObservation {

    const quantity = <Number>(this.updateObservationForm.value.quantity);
    const dateTime = <Date>(new Date(this.updateObservationForm.value.observationDateTime));
    const selectedBird = <IBirdSummary>(this.selectSpeciesForm.value);
    const position = <IObservationPosition>{
      latitude: this._mapComponent.latitude,
      longitude: this._mapComponent.longitude,
      formattedAddress: this._mapComponent.formattedAddress,
      shortAddress: this._mapComponent.shortAddress
    };

    const notes: IObservationNote[] = this._notesComponent.notes.map(note => (
      { // One can also get the updated notes from this.obervation (object is passed by reference to notes child component)
        id: 0,
        noteType: note.noteType,
        note: note.note
      }));

    const observation = <IUpdateObservation>{
      observationId: this.observation.observationId,
      quantity: quantity,
      observationDateTime: dateTime,
      bird: selectedBird,
      user: this.observation.user,
      position: position,
      notes: notes,
    }

    return observation;
  }

  public redirect(): void {
    this._redirect();
  }

  private _redirect(): void {
    this._navigation.back();
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
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
