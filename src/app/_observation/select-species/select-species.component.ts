import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SelectSpeciesService } from '../select-species/select-species.service';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-species',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './select-species.component.html',
  styleUrl: './select-species.component.scss'
})
export class SelectSpeciesComponent implements OnInit {
  @Input() selectSpeciesForm: FormGroup
  filteredBirds: Observable<IBirdSummary[]>;

  constructor(readonly _service: SelectSpeciesService) { }

  ngOnInit(): void {
    this._service.getData();
    this.filter();
  }

  public filter(): void {
    this.filteredBirds = this.selectSpeciesForm.valueChanges.pipe(
      startWith(''),
      map(bird => (bird ? this._filterBirds(bird) : this._service.getBirds.slice())),
    );
  }

  public displayFn(user: IBirdSummary): string {
    return user && user.englishName ? user.englishName : '';
  }

  public reload(): void {
    alert('hello')
    this._service.getData();
  }

  private _filterBirds(value: any): IBirdSummary[] {
    if (value.bird.englishName) { // full IBirdSummary object selected from the list
      const filterValue = value.bird.englishName.toLowerCase();
      return this._service.getBirds.filter((bird: IBirdSummary) => bird.englishName.toLowerCase().includes(filterValue));
    } else { // freetext string typed into the control
      const filterValue = value.bird.toLowerCase();
      return this._service.getBirds.filter((bird: IBirdSummary) => bird.englishName.toLowerCase().includes(filterValue));
    }
  }
}
// import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
// import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
// import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
// import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
// import { SelectSpeciesService } from './select-species.service';
// import { NgIf, AsyncPipe } from '@angular/common';

// @Component({
//     selector: 'app-select-species',
//     templateUrl: './select-species.component.html',
//     styleUrls: ['./select-species.component.scss'],
//     encapsulation: ViewEncapsulation.None,
//     standalone: true,
//     imports: [FormsModule, ReactiveFormsModule, NgbTypeahead, NgIf, AsyncPipe]
// })
// export class SelectSpeciesComponent implements OnInit {
//   @Input() selectSpeciesForm: FormGroup;

//   @ViewChild('instance', { static: true }) instance: NgbTypeahead;
//   focus$ = new Subject<string>();
//   click$ = new Subject<string>();

//   constructor(readonly _service: SelectSpeciesService) { }

//   ngOnInit(): void {
//     this._service.getData();
//   }

//   public search: OperatorFunction<string, readonly IBirdSummary[]> = (text$: Observable<string>) => {
//     const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
//     const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
//     const inputFocus$ = this.focus$;

//     return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
//       map(term => (term === '' ? this._service.getBirds
//         : this._service.getBirds.filter(species => species.englishName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0))
//     );
//   }

//   public formatter = (x: { englishName: string }) => x.englishName;

//   public reload(): void {
//     this._service.getData();
//   }
// }