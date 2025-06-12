'use strict';

// Facade that wraps Map and Node.js Timers to provide a simple interface for a
// collection with values that have expiration timeout.

class TimeoutCollection {
  constructor(timeout) {
    this.timeout = timeout;
    this.collection = new Map();
    this.timers = new Map();
    this.isNode = typeof process !== 'undefined' && process.versions?.node;
  }

  set(key, value) {
    this.delete(key);

    const timeoutId = setTimeout(() => {
      this.delete(key);
    }, this.timeout);

    if (this.isNode && typeof timeoutId.unref === 'function') {
      timeoutId.unref();
    }

    this.collection.set(key, value);
    this.timers.set(key, timeoutId);
  }

  get(key) {
    return this.collection.get(key);
  }

  delete(key) {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
      this.collection.delete(key);
      return true;
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

  has(key) {
    return this.collection.has(key);
  }

  size() {
    return this.collection.size;
  }

  toArray() {
    return [...this.collection.entries()];
  }

  destroy() {
    this.clear();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimeoutCollection;
} else {
  window.TimeoutCollection = TimeoutCollection;
}

// Usage

if (typeof process !== 'undefined' && process.versions?.node) {
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
      hash.destroy();
    }, 500);
  }, 1500);
}
