import * as diffArraysOfObjects from "diff-arrays-of-objects";

export function detectAddedObejct<T>(objA: object, objB: object, key: string) {
  return diffArraysOfObjects<T>(objA, objB, key);
}
