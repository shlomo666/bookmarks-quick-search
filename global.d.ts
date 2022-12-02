interface Array<T> {
  minBy(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): T;

  keyBy(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): Record<string, T>;
}
