'use strict';

const { EventEmitter } = require('node:events');

class Logger {
  static COLORS = {
    warn: '\x1b[1;33m',
    error: '\x1b[0;31m',
    info: '\x1b[1;37m',
  };

  constructor(output = console) {
    this.output = output;
  }

  color(level) {
    return Logger.COLORS[level] || Logger.COLORS.info;
  }

  log(level, s) {
    const date = new Date().toISOString();
    const color = this.color(level);
    this.output.log(color + date + '\t' + s + '\x1b[0m');
  }

  warn(s) {
    this.log('warn', s);
  }

  error(s) {
    this.log('error', s);
  }

  info(s) {
    this.log('info', s);
  }
}

class Task extends EventEmitter {
  constructor(name, exec) {
    super();
    this.name = name;
    this.exec = exec;
    this.running = false;
    this.count = 0;
    this.timer = null;
  }

  get active() {
    return !!this.timer;
  }

  start() {
    this.stop();
    if (this.running) return false;
    const time = this.time - Date.now();
    if (time < 0) return false;
    this.timer = this.set(() => {
      this.run();
    }, time);
    return true;
  }

  stop() {
    if (!this.active || this.running) return false;
    this.clear(this.timer);
    this.timer = null;
    return true;
  }

  run() {
    if (!this.active || this.running) return false;
    this.running = true;
    this.emit('begin', this);
    this.exec((err, res) => {
      if (err) this.emit('error', err, this);
      this.emit('end', res, this);
      this.count++;
      this.running = false;
    });
    return true;
  }
}

class IntervalTask extends Task {
  constructor(name, time, exec) {
    super(name, exec);
    this.time = Date.now() + time;
    this.set = setInterval;
    this.clear = clearInterval;
  }
}

class TimeoutTask extends Task {
  constructor(name, time, exec) {
    super(name, exec);
    this.time = new Date(time).getTime();
    this.set = setTimeout;
    this.clear = clearTimeout;
  }
}

class Scheduler extends EventEmitter {
  constructor({ options = { output: console } } = {}) {
    super();
    this.tasks = new Map();
    this.logger = new Logger(options.output);
  }

  task(name, time, exec) {
    this.stop(name);
    const task = typeof time === 'number'
      ? new IntervalTask(name, time, exec)
      : new TimeoutTask(name, time, exec);
    this.tasks.set(name, task);
    task.on('error', (err) => {
      this.logger.error(`${task.name}\t${err.message}`);
      this.emit('error', err, task);
    });
    task.on('begin', () => {
      this.logger.info(`${task.name}\tbegin`);
    });
    task.on('end', (res = '') => {
      this.logger.warn(`${task.name}\tend\t${res}`);
    });
    task.start();
    return task;
  }

  stop(name) {
    const task = this.tasks.get(name);
    if (task) {
      task.stop();
      this.tasks.delete(name);
    }
  }

  stopAll() {
    for (const name of this.tasks.keys()) {
      this.stop(name);
    }
  }
}

// Usage
const scheduler = new Scheduler({ options: { output: console } });

scheduler.on('error', (err, task) => {
  console.log(`Error in ${task.name}:\n ${err.stack}`);
  //process.exit(1);
});

scheduler.task('name1', '2035-03-12T14:37Z', (done) => {
  setTimeout(() => {
    done(null, 'task successed');
  }, 1000);
});

scheduler.task('name2', '2035-03-12T14:37Z', (done) => {
  setTimeout(() => {
    done(new Error('task failed'));
  }, 1100);
});

scheduler.task('name3', 500, (done) => {
  setTimeout(() => {
    done(null, 'task successed');
  }, 1200);
});

scheduler.task('name4', 800, (done) => {
  setTimeout(() => {
    done(new Error('task failed'));
  }, 2000);
});
