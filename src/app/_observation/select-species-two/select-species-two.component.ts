import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SelectSpeciesService } from '../select-species/select-species.service';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';

@Component({
  selector: 'app-select-species-two',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './select-species-two.component.html',
  styleUrl: './select-species-two.component.scss'
})
export class SelectSpeciesTwoComponent implements OnInit {
  @Input() selectSpeciesForm: FormGroup
  filteredStates: Observable<IBirdSummary[]>;

  constructor(readonly _service: SelectSpeciesService) { }

  // todo:
  // reload on error which calls getData method in service
  // change methods and variable names

  ngOnInit(): void {
    // this._service.getData();
    this.filter();
  }

  public filter(): void {
    this.filteredStates = this.selectSpeciesForm.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this._service.getBirds.slice())),
    );
  }

  public displayFn(user: IBirdSummary): string {
    return user && user.englishName ? user.englishName : '';
  }

  private _filterStates(value: any): IBirdSummary[] {
    if (value.bird.englishName) { // full IBirdSummary object selected from the list
      const filterValue = value.bird.englishName.toLowerCase();
      return this._service.getBirds.filter((state: IBirdSummary) => state.englishName.toLowerCase().includes(filterValue));
    } else { // freetext string typed into the control
      const filterValue = value.bird.toLowerCase();
      return this._service.getBirds.filter((state: IBirdSummary) => state.englishName.toLowerCase().includes(filterValue));
    }
  }
}