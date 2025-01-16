import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'observationSummary',
  
})
export class ObservationSummaryPipe implements PipeTransform {

  transform(species: number, observations: number): string {
    var plural = observations > 1 ? 'observations' : 'observation';
    return `${species} species in ${observations} ${plural}.`
  }

  // add extra option bool parameter for long or short summary: shortSummary: bool = false
  // long summary has extra clause: 'You have spotted...' at the start
}
