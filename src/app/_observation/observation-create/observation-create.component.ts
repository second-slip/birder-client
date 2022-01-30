import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-observation-create',
  templateUrl: './observation-create.component.html',
  styleUrls: ['./observation-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ObservationCreateComponent implements OnInit {

  //
  addObservationForm: FormGroup;
  //

  constructor() { }

  ngOnInit(): void {
  }


  public onStepperSelectionChange() {
    this._scrollToSectionHook();
    //this.stepper.selectionChange.subscribe((event) => { this.scrollToSectionHook(event.selectedIndex); });
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
