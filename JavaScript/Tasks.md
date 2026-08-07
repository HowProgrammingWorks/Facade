# Facade tasks

1. Analyze `1-prototype.js` and implement a facade over Timers to be compatible with frontend and backend (Node.js).
2. Make implementation from `2-class.js` compatible with [Map interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and prepare .d.ts files.
3. Improve implementation in `3-function.js` to be mix-ins free and better optimized for V8. Hint: return object literal from `timeoutCollection`
4. Rewrite `3-function.js` to avoid setTimeout for every key. Hint: manually track ttl of each key on every access. Optionally, add a global flush timer for all keys.
5. Fix eslint warning for `4-scheduler.js` with message `Expected this to be used by class method log`, adding constructor for `Logger` class to pass instance of `Console`, pass mentioned instance to `new Scheduler({ options: { output: Console } })`
6. Remove `Task` constructor: remove if statement and use either two methods or two subclasses as well for `Scheduler` method `task`
