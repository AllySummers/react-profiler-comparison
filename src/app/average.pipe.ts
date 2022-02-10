import { Pipe, PipeTransform } from '@angular/core';
import { average } from './utils/average.util';

@Pipe({
  name: 'average'
})
export class AveragePipe implements PipeTransform {

  transform(input: Array<number>): number {
    return average(input);
  }

}
