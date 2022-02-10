import { Pipe, PipeTransform } from '@angular/core';
import { sum } from './utils/sum.util';

@Pipe({
  name: 'sumArray'
})
export class SumArrayPipe implements PipeTransform {

  transform(input: Array<Array<number>>): Array<number> {
    return input.map(sum);
  }

}
