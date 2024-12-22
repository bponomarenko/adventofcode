export const formatInput = input => input.split('\n').map(Number);

const mix = (secret, num) => secret ^ num & 0xFFFFFF;

const evolve = secret => {
  const changes = [];
  let count = 2000;
  while (count > 0) {
    const lastBit = secret % 10;
    secret = mix(secret, secret << 6);
    secret = mix(secret, secret >> 5);
    secret = mix(secret, secret << 11);
    const newBit = secret % 10;
    changes.push([newBit, newBit - lastBit]);
    count -= 1;
  }
  return [secret, changes];
};

export const part1 = input => input.sum(secret => evolve(secret)[0]);

export const part2 = input => {
  const allSequences = new Set();
  const sequences = input.map(secret => {
    const changes = evolve(secret)[1];
    const memory = new Map();
    for (let i = 3; i < changes.length; i += 1) {
      const sequence = `${changes[i - 3][1]},${changes[i - 2][1]},${changes[i - 1][1]},${changes[i][1]}`;
      if (memory.has(sequence)) {
        continue;
      }
      memory.set(sequence, changes[i][0]);
      allSequences.add(sequence);
    }
    return memory;
  });
  return Math.max(...Array.from(allSequences).map(sequence => sequences.sum(memory => (memory.has(sequence) ? memory.get(sequence) : 0))));
};
