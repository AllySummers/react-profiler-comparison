export const sortFn = (a: number, b:number) => a - b;

export const sort = (arr: Array<number>) => arr.sort(sortFn);

export const sortKey = <T extends { [x in K]: number }, K extends keyof T>(key: K) => (a: T, b: T) => a[key] = b[key];