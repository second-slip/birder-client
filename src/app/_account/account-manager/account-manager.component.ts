import { Component, ViewEncapsulation } from '@angular/core';
import { AccountManageAvatarComponent } from '../account-manage-avatar/account-manage-avatar.component';
import { AccountManageLocationComponent } from '../account-manage-location/account-manage-location.component';
import { AccountManagePasswordComponent } from '../account-manage-password/account-manage-password.component';
import { AccountManageProfileComponent } from '../account-manage-profile/account-manage-profile.component';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-account-manager',
    templateUrl: './account-manager.component.html',
    styleUrls: ['./account-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase, NgbNavContent, AccountManageProfileComponent, AccountManagePasswordComponent, AccountManageLocationComponent, AccountManageAvatarComponent, NgbNavOutlet]
})
export class AccountManagerComponent { }
