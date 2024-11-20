import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink]
})
export class FooterComponent {
  public message: string;

  constructor() {
    const year = new Date().getFullYear().toString();
    this.message = `\u00A9 ${year} Birder`
  }
}
