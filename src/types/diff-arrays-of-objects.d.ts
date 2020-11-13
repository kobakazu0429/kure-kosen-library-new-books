declare module "diff-arrays-of-objects" {
  function diff<T>(
    objA: object,
    objB: object,
    key: string
  ): { same: T[]; added: T[]; updated: T[]; removed: T[] };
  namespace diff {}
  export = diff;
}
