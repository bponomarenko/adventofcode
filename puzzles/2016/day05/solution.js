import WorkerPool from '../../../lib/workers/worker-pool.js';

export const formatInput = input => input;

// Worker threads makes it work 3x times faster
export const part1 = input => new Promise(resolve => {
  const pool = new WorkerPool({ workerPath: new URL('find-hash-part1-worker.js', import.meta.url).pathname });
  const step = 100000;
  const hash = [];
  const limit = 8;
  let totalCount = 0;
  let i = 0;

  pool.on('done', () => {
    pool.close();
    resolve(hash.join('').slice(0, limit));
  });

  const runTask = iter => {
    pool.runTask({ input, start: iter * step, finish: (iter + 1) * step }, partial => {
      hash[iter] = partial;
      totalCount += partial.length;

      if (totalCount < limit) {
        // Spawn more workers
        runTask(i);
        i += 1;
      }
    });
  };

  // Start with max amount of threads, and then add more if needed
  for (; i < pool.threads; i += 1) {
    runTask(i);
  }
});

// Worker threads makes it work almost 4x times faster
export const part2 = input => new Promise(resolve => {
  const pool = new WorkerPool(new URL('find-hash-part2-worker.js', import.meta.url).pathname);
  const pass = new Map();
  const step = 1000000;
  const limit = 8;
  let i = 0;

  pool.on('done', () => {
    pool.close();

    const hash = Array.from(pass.entries())
      .sort(([a], [b]) => a - b)
      .map(([, char]) => char)
      .join('');
    resolve(hash);
  });

  const runTask = iter => {
    pool.runTask({ input, start: iter * step, finish: (iter + 1) * step }, res => {
      if (res === 'done') {
        if (pass.size < limit) {
          // Spawn more workers
          runTask(i);
          i += 1;
        }
      } else if (!pass.has(res[0])) {
        pass.set(res[0], res[1]);
      }
    });
  };

  // Start with max amount of threads, and then add more if needed
  for (; i < pool.threads; i += 1) {
    runTask(i);
  }
});
