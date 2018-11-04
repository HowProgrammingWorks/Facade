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
    this.collection.set(key, value);
    this.timers.set(key, timeout);
  }

  get(key) {
    return this.collection.get(key);
  }

  delete(key) {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.collection.delete(key);
      this.timers.delete(key);
    }
  }

  toArray() {
    return [...this.collection.entries()];
  }
}

// Usage

const hash = new TimeoutCollection(1000);
hash.set('uno', 1);
setTimeout(() => {
  hash.set('due', 2);
  hash.set('tre', 3);
  console.dir({ array: hash.toArray() });
}, 1500);
