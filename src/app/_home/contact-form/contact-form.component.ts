import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { finalize, Subject, throwError, takeUntil } from 'rxjs';
import { ContactFormModel } from './contact-form-model';
import { ContactFormService } from './contact-form.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactFormComponent implements OnDestroy {
  private _subscription = new Subject();
  public model: ContactFormModel;
  public requesting = false;
  public submitted = false;
  public errorObject = null;

  constructor(private service: ContactFormService) {
    this.model = new ContactFormModel('', '', '');
  }

  public onSubmit(): void {
    this.requesting = true;

    this.service.postMessage(this.model)
      .pipe(finalize(() => { this.requesting = false; }), takeUntil(this._subscription))
      .subscribe({
        next: () => { this.submitted = true; },
        error: (e: any) => {
          this.errorObject = e;
          return throwError(() => e);
        }
      })
  }

  public onReset(): void {
    this.model = new ContactFormModel('', '', '');
  }

  ngOnDestroy(): void {
    this._subscription.next('');
    this._subscription.complete();
  }
}