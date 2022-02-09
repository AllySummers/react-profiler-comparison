export const sumFn = (acc: number, cur: number) => acc + cur;

export const sum = (arr: Array<number>) => arr.reduce(sumFn, 0);