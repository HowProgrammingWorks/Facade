declare class TimeoutCollection<K, V> {
  constructor(timeout: number);

  set(key: K, value: V): this;
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  size(): number;
  toArray(): [K, V][];
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
  entries(): IterableIterator<[K, V]>;
  [Symbol.iterator](): IterableIterator<[K, V]>;

  private collection: Map<K, V>;
  private timers: Map<K, NodeJS.Timeout | number>;
  private timeout: number;
}

export = TimeoutCollection;
