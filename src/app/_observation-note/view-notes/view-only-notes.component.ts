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



// add notes:

// notes: ObservationNote[] = [];

// constructor(public dialog: MatDialog) { }

// ngOnInit(): void { }

// openAddNoteDialog(): void {
//   const dialogRef = this.dialog.open(AddNoteDialogComponent, {
//     width: '325px',
//     data: new ObservationNote(0, ObservationNoteType.General, '')
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       this.addNote(result);
//     }
//   });
// }

// openEditNoteDialog(note: ObservationNote): void {
//   const dialogRef = this.dialog.open(EditNoteDialogComponent, {
//     width: '325px',
//     data: note
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       this.editNote(result);
//     }
//   });
// }

// addNote(note: ObservationNote): void {
//   this.notes.push(note);
// }

// editNote(note: ObservationNote): void {
//   // var foundIndex = items.findIndex(x => x.id == item.id);
//   const i = this.notes.indexOf(note);
//   this.notes[i] = note;
// }

// removeNote(note: ObservationNote): void {
//   const i = this.notes.indexOf(note);
//   this.notes.splice(i, 1);
// }


// edit notes:

// @Input() notes: ObservationNote[] = [];

// constructor(public dialog: MatDialog) { }

// ngOnInit(): void { }

// openEditNoteDialog(note: ObservationNote): void {
//   const dialogRef = this.dialog.open(EditNoteDialogComponent, {
//     width: '325px',
//     data: note
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       this.editNote(result);
//     }
//   });
// }

// openAddNoteDialog(): void {
//   const dialogRef = this.dialog.open(AddNoteDialogComponent, {
//     width: '325px',
//     data: new ObservationNote(0, ObservationNoteType.General, '')
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
//       this.addNote(result);
//     }
//   });
// }

// addNote(note: ObservationNote): void {
//   this.notes.push(note);
// }

// editNote(note: ObservationNote): void {
//   // var foundIndex = items.findIndex(x => x.id == item.id);
//   const i = this.notes.indexOf(note);
//   this.notes[i] = note;
// }

// removeNote(note: ObservationNote): void {
//   const i = this.notes.indexOf(note);
//   this.notes.splice(i, 1);
// }
