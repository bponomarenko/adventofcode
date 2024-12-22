export const formatInput = input => input.split('\n').map(BigInt);

const mix = (secret, num) => secret ^ num % BigInt(16777216);

const evolve = (secret, count = 2000) => {
  const changes = [];
  while (count > 0) {
    const lastBit = secret % BigInt(10);
    secret = mix(secret, secret * BigInt(64));
    secret = mix(secret, secret / BigInt(32));
    secret = mix(secret, secret * BigInt(2048));
    const newBit = secret % BigInt(10);
    changes.push([newBit, newBit - lastBit]);
    count -= 1;
  }
  return [secret, changes];
};

const sum = (arr, fn) => arr.reduce((acc, item, i) => acc + fn(item, i), BigInt(0));

export const part1 = input => sum(input, secret => evolve(secret)[0]).toString();

function* changeDiffs(from, count) {
  for (let i = 9; i >= 0; i -= 1) {
    const diff = i - from;
    if (count === 0) {
      yield diff;
    } else {
      for (const change of changeDiffs(i, count - 1)) {
        yield `${diff},${change}`;
      }
    }
  }
}

function* changeSequences() {
  const memory = new Set();
  for (let i = 9; i >= 0; i -= 1) {
    for (const change of changeDiffs(i, 3)) {
      if (memory.has(change)) {
        continue;
      }
      memory.add(change);
      yield change;
    }
  }
}

export const part2 = input => {
  const sequences = input.map(secret => {
    const changes = evolve(secret)[1];
    const memory = new Map();
    for (let i = 3; i < changes.length; i += 1) {
      memory.set(`${changes[i - 3][1]},${changes[i - 2][1]},${changes[i - 1][1]},${changes[i][1]}`, changes[i][0]);
    }
    return memory;
  });

  let max = BigInt(0);
  for (const sequence of changeSequences()) {
    const total = sum(sequences, memory => (memory.has(sequence) ? memory.get(sequence) : BigInt(0)));
    if (total > max) {
      max = total;
    }
  }
  return max.toString();
};
