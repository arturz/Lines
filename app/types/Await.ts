/*
  unwraps Promise e.g.
  
  const testPromise = async () => 42
  type t1 = Await<ReturnType<typeof testPromise>>
  // t1 => number
*/
export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;
