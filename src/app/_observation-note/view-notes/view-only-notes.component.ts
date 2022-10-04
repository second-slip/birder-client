import { Component, Input, OnInit } from '@angular/core';
import { IObservationNote } from '../i-observation-note.dto';

@Component({
  selector: 'app-view-only-notes',
  templateUrl: './view-only-notes.component.html',
  styleUrls: ['./view-only-notes.component.scss']
})
export class ViewOnlyNotesComponent   {
  @Input() notes: IObservationNote[];
}
