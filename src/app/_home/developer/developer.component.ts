import { Component, ViewEncapsulation } from '@angular/core';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-developer',
    templateUrl: './developer.component.html',
    styleUrls: ['./developer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase]
})
export class DeveloperComponent { }



// export interface Experience {
//   type: string;
//   detail: string;
// }

// const Data: Experience[] = [
//   {type: 'Languages:', detail: 'C#, TypeScript, SQL'},
//   {type: '.NET:', detail: ".NET 5 (Core), ASP.NET, MVC, .NET Framework 4 WPF MVVM, \n Entity Framework/Core (code-first), LINQ, AutoMapper; \n XUnit, Moq"}
// ]
