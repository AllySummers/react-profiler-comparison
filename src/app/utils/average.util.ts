import { sum } from './sum.util';

export const average = (arr: Array<number>) => (sum(arr) / arr.length) || 0;