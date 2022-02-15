import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  // templateUrl: './toast.component.html',
  // styleUrls: ['./toast.component.scss'],
  // encapsulation: ViewEncapsulation.None
  //   template: `
  //   <ngb-toast
  //     *ngFor="let toast of toastService.toasts"
  //     [class]="toast.classname"
  //     [autohide]="true"
  //     [delay]="toast.delay || 5000"
  //     (hidden)="toastService.remove(toast)"
  //   >
  //     <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
  //       <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
  //     </ng-template>

  //     <ng-template #text>{{ toast.textOrTpl }}</ng-template>
  //   </ngb-toast>
  // `,
  template: `
    <ngb-toast
*ngFor="let toast of toastService.toasts"
[header]="toast.header" [autohide]="true" [delay]="toast.delay || 5000"
(hide)="toastService.remove(toast)"
>{{toast.body}}</ngb-toast>`,
  host: { 'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200' }
})
export class ToastComponent implements OnInit {

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
  }

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
}
