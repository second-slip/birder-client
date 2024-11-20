import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { SelectSpeciesService } from '../select-species/select-species.service';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-select-species',
    imports: [FormsModule, ReactiveFormsModule, CommonModule,
        MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './select-species.component.html',
    styleUrl: './select-species.component.scss'
})
export class SelectSpeciesComponent implements OnInit {
  @Input() selectSpeciesForm: FormGroup
  public filteredBirds: Observable<IBirdSummary[]>;

  constructor(readonly _service: SelectSpeciesService) { }

  ngOnInit(): void {
    this.filter();
  }

  public filter(): void {
    this.filteredBirds = this.selectSpeciesForm.valueChanges.pipe(
      startWith(''),
      map(bird => (bird ? this._filterBirds(bird) : this._service.birds().slice())),
    );
  }

  public displayFn(bird: IBirdSummary): string {
    return bird && bird.englishName ? bird.englishName : '';
  }

  private _filterBirds(value: any): IBirdSummary[] {
    if (value.bird.englishName) { // full IBirdSummary object selected from the list
      const filterValue = value.bird.englishName.toLowerCase();
      return this._service.birds().filter((bird: IBirdSummary) => bird.englishName.toLowerCase().includes(filterValue));
    } else { // freetext string typed into the control
      const filterValue = value.bird.toLowerCase();
      return this._service.birds().filter((bird: IBirdSummary) => bird.englishName.toLowerCase().includes(filterValue));
    }
  }
}