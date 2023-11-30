import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'observationPlural',
  standalone: true
})
export class ObservationPluralPipe implements PipeTransform {

  transform(count: number): string {
    return  count > 1 ? 'observations' : 'observation';
  }
}
