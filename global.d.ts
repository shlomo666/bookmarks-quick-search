interface Array<T> {
  minBy(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): T;
}
