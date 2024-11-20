import { Component, ViewEncapsulation } from '@angular/core';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout-sidebar',
    templateUrl: './layout-sidebar.component.html',
    styleUrls: ['./layout-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [RouterOutlet, SideMenuComponent]
})
export class LayoutSidebarComponent { }