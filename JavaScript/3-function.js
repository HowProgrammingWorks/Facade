'use strict';

const timeoutCollection = (interval) => {
  const collection = new Map();
  const expirations = new Map();

  return {
    set(key, value) {
      const expiration = Date.now() + interval;
      collection.set(key, value);
      expirations.set(key, expiration);
      return this;
    },
    get(key) {
      this.cleanup();
      return collection.get(key);
    },
    delete(key) {
      collection.delete(key);
      expirations.delete(key);
    },
    toArray() {
      this.cleanup();
      return [...collection.entries()];
    },
    cleanup() {
      const now = Date.now();
      for (const [key, expiration] of expirations.entries()) {
        if (now >= expiration) {
          collection.delete(key);
          expirations.delete(key);
        }
      }
    }
  };
};

// Usage
const hash = timeoutCollection(1000);
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
    hash.cleanup(); // Manually trigger cleanup
  }, 500);
}, 1500);
