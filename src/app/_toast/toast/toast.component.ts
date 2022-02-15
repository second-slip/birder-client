import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  // templateUrl: './toast.component.html',
  // styleUrls: ['./toast.component.scss'],
  // encapsulation: ViewEncapsulation.None

  // *ngFor="let toast of toastService.toasts"
  template: `
    <div class="toast-container"
*ngFor="let toast of toastService.toasts"
 data-bs-delay="5000">
 <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
 <div class="toast-header">
 <img src="..." class="rounded me-2" alt="...">
 <strong class="me-auto">Bootstrap</strong>
 <small class="text-muted">just now</small>
 <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
</div>
<div class="toast-body">
See? Just like this.
</div>
</div>

 
 </div>`,
host: { 'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200' }
})
export class ToastComponent implements OnInit {

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
  }

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
}
