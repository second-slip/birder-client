import { Component, ViewEncapsulation } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, ContactFormComponent]
})
export class ContactComponent {

  constructor() {}

}
