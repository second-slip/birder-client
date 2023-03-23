import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';
import { SelectSpeciesService } from './select-species.service';

@Component({
  selector: 'app-select-species',
  templateUrl: './select-species.component.html',
  styleUrls: ['./select-species.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectSpeciesComponent implements OnInit {
  @Input() selectSpeciesForm: FormGroup;

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(readonly _service: SelectSpeciesService) { }

  ngOnInit(): void {
    this._fetchData();
  }

  public search: OperatorFunction<string, readonly IBirdSummary[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this._service.getBirds
        : this._service.getBirds.filter(species => species.englishName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0))
    );
  }

  public formatter = (x: { englishName: string }) => x.englishName;

  public reload(): void {
    this._fetchData();
  }

  private _fetchData(): void {
    this._service.getData();
  }
}