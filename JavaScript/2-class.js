'use strict';

class TimeoutCollection {
  constructor(timeout) {
    this.timeout = timeout;
    this.collection = new Map();
    this.timers = new Map();
  }

  set(key, value) {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);
    const timeout = setTimeout(() => {
      this.delete(key);
    }, this.timeout);
    if (typeof timeout.unref === 'function') timeout.unref();
    this.collection.set(key, value);
    this.timers.set(key, timeout);
    return this;
  }

  get(key) {
    return this.collection.get(key);
  }

  has(key) {
    return this.collection.has(key);
  }

  delete(key) {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
      return this.collection.delete(key);
    }
    return false;
  }

  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.collection.clear();
  }

  size() {
    return this.collection.size;
  }

  toArray() {
    return [...this.collection.entries()];
  }

  forEach(callbackfn, thisArg) {
    return this.collection.forEach(callbackfn, thisArg);
  }

  keys() {
    return this.collection.keys();
  }

  values() {
    return this.collection.values();
  }

  entries() {
    return this.collection.entries();
  }

  [Symbol.iterator]() {
    return this.collection[Symbol.iterator]();
  }
}

// Usage
const hash = new TimeoutCollection(1000);
hash.set('uno', 1);
console.dir({ array: hash.toArray() });

hash.set('due', 2);
console.dir({ array: hash.toArray() });

setTimeout(() => {
  hash.set('tre', 3);
  console.dir({ array: hash.toArray() });

  setTimeout(() => {
    hash.set('quattro', 4);
    console.dir({ array: hash.toArray() });
  }, 500);
}, 1500);
