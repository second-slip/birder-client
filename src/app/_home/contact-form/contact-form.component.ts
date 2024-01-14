import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ContactFormModel } from './contact-form-model';
import { ContactFormService } from './contact-form.service';
import { FormsModule } from '@angular/forms';

import { NgIf } from '@angular/common';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf,  FormsModule]
})
export class ContactFormComponent implements OnDestroy {
  private _subscription = new Subject();
  public model: ContactFormModel;
  public requesting = false;
  public submitProgress: 'idle' | 'success' | 'error' = 'idle';

  constructor(private service: ContactFormService) {
    this.model = new ContactFormModel('', '', '');
  }

  public onSubmit(): void {

    if(!this.model.name || !this.model.email || !this.model.message) return;

    this.requesting = true;

    this.service.postMessage(this.model)
      .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: () => { this.submitProgress = 'success'; },
        error: (e: any) => { this.submitProgress = 'error'; }
      })
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}