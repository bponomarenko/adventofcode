import os from 'os';
import { EventEmitter } from 'events';
import { Worker } from 'worker_threads';
import { AsyncResource } from 'async_hooks';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  call(result) {
    this.runInAsyncScope(this.callback, null, result);
  }

  destroy() {
    this.emitDestroy();
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(options) {
    super();
    this.workerPath = options?.workerPath;
    this.threads = options?.threads || (os.cpus().length - 1);
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < this.threads; i += 1) {
      this.addNewWorker();
    }

    // True by default
    const autoClose = options?.autoClose != null ? options.autoClose : true;

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const task = this.tasks.shift();
        this.runTask(task.context, task.callback, task.workerPath);
      } else if (this.workers.length === this.freeWorkers.length) {
        // All workers finished their work
        if (autoClose) {
          this.close();
        }
        this.emit('done');
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('worker-wrapper.js', import.meta.url));

    worker.on('message', message => {
      if (message.type === 'done') {
        // In case of success: remove the `TaskInfo` associated with the Worker, and mark it as free again.
        worker[kTaskInfo].destroy();
        worker[kTaskInfo] = null;
        this.freeWorkers.push(worker);
        this.emit(kWorkerFreedEvent);
      } else if (message.type === 'data') {
        // Call callback with worker data
        worker[kTaskInfo].call(message.data);
      }
    });

    worker.on('error', error => {
      // Do not recover from errors, just emit them
      throw error;
    });

    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(context, callback, workerPath) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ context, callback, workerPath });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage({ context, workerPath: workerPath || this.workerPath });
  }

  close() {
    this.workers.forEach(worker => {
      worker.terminate();
    });
  }
}
