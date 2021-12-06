import { createHash } from 'crypto';
import WorkerPool from '../../../lib/workers/worker-pool.js';

export const formatInput = input => input;

const trippleRe = /([a-z0-9])\1\1/;

// This solution is fast enough even without workers
export const part1 = input => {
  let inc = 0;
  let matchers = [];
  let keys = new Set();
  let latestInc;

  while (keys.size < 64) {
    const hash = createHash('md5').update(`${input}${inc}`).digest('hex');

    matchers.forEach(matcher => {
      if (keys.size < 64 && !matcher.done && inc <= matcher.until && matcher.regex.test(hash)) {
        keys.add(matcher.hash);
        latestInc = matcher.inc;
        matcher.done = true;
      }
    });

    let match = trippleRe.exec(hash);
    if (match) {
      matchers.push({ regex: new RegExp(`${match[1]}{5}`), until: inc + 1000, hash, inc });
    }
    inc += 1;
  }
  return latestInc;
};

// For part2 parallelization was necessary (to get under 1 min)
export const part2 = input => new Promise(resolve => {
  const pool = new WorkerPool({ workerPath: new URL('get-hash-worker.js', import.meta.url).pathname, autoClose: false });

  const hashes = new Map();
  const hashesBatch = 5_000;
  const emitBatch = 500;

  let matchers = [];
  let count = 0;
  let latestInc;
  let missingHash;
  let requestedHashesCount = 0;

  const runIteration = inc => {
    if (!hashes.has(inc)) {
      // Pause iterations until hash is found
      missingHash = inc;
      return;
    }

    const hash = hashes.get(inc);
    matchers.forEach(matcher => {
      if (count < 64 && !matcher.done && inc <= matcher.until && matcher.regex.test(hash)) {
        count += 1;
        latestInc = matcher.inc;
        matcher.done = true;
      }
    });

    let match = trippleRe.exec(hash);
    if (match) {
      matchers.push({ regex: new RegExp(`${match[1]}{5}`), until: inc + 1000, hash, inc });
    }

    if (count >= 63) {
      pool.close();
      resolve(latestInc);
    } else {
      // Request next batch of hashes
      if (requestedHashesCount - inc < 100) {
        // eslint-disable-next-line no-use-before-define
        requestHashes();
      }
      setImmediate(() => runIteration(inc + 1));
    }
  };

  const requestHashes = () => {
    const start = requestedHashesCount;
    // Do that in batches
    requestedHashesCount = start + hashesBatch;

    for (let i = start; i < requestedHashesCount; i += emitBatch) {
      const inc = i;
      pool.runTask({ input, start: inc, end: inc + emitBatch }, calculatedHashes => {
        calculatedHashes.forEach((hash, pos) => {
          hashes.set(inc + pos, hash);
        });

        if (missingHash != null) {
          const hash = missingHash;
          missingHash = null;
          // Try to continue iterations
          runIteration(hash);
        }
      });
    }
  };

  requestHashes();

  // Start iterations
  runIteration(0);
});
