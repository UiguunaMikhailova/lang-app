interface Group<T> {
  [key: string]: T;
}

type Maybe<T> = T | null;

export { Group, Maybe };
