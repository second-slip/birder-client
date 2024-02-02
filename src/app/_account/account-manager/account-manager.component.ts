import { Component } from '@angular/core';
import { AccountManageAvatarComponent } from '../account-manage-avatar/account-manage-avatar.component';
import { AccountManageLocationComponent } from '../account-manage-location/account-manage-location.component';
import { AccountManagePasswordComponent } from '../account-manage-password/account-manage-password.component';
import { AccountManageProfileComponent } from '../account-manage-profile/account-manage-profile.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-account-manager',
    templateUrl: './account-manager.component.html',
    styleUrls: ['./account-manager.component.scss'],
    standalone: true,
    imports: [MatTabsModule, AccountManageProfileComponent, AccountManagePasswordComponent, AccountManageLocationComponent, AccountManageAvatarComponent]
})
export class AccountManagerComponent { }
