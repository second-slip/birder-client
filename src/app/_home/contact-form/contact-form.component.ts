import { Component, ViewEncapsulation } from '@angular/core';
import { throwError } from 'rxjs';
import { ContactFormModel } from './contact-form-model';
import { ContactFormService } from './contact-form.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactFormComponent {
  public model: ContactFormModel;
  public requesting = false;
  public submitted = false;
  public errorObject = null;

  constructor(private service: ContactFormService) {
    this.model = new ContactFormModel('', '', '');
  }

  public onReset(): void {
    this.model = new ContactFormModel('', '', '');
  }

  public onSubmit(): void {
    this.requesting = true;

    this.service.postMessage(this.model)
      .subscribe({
        next: () => {
          this.submitted = true;
          this.requesting = false;
        },
        error: (e: any) => {
          this.errorObject = e;
          this.requesting = false;
          return throwError(() => e);
        }
      })
  }
}