import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'followersPlural',
  standalone: true
})
export class FollowersPluralPipe implements PipeTransform {

  transform(count: number): string {
    return count > 1 ? 'followers' : 'follower';
  }

}
