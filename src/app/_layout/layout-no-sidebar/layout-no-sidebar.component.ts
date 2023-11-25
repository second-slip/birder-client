import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout-no-sidebar',
    templateUrl: './layout-no-sidebar.component.html',
    styleUrls: ['./layout-no-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterOutlet]
})
export class LayoutNoSidebarComponent  {}
