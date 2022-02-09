import { Pipe, PipeTransform } from '@angular/core';
import { sum } from './utils/sum.util';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(input: Array<number>): number {
    return sum(input);
  }

}
