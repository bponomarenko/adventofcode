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
  const totals = new Map();
  input.forEach(secret => {
    const changes = evolve(secret)[1];
    const sequences = new Set();
    changes.slice(3).forEach(([price, change], i) => {
      const sequence = `${changes[i][1]},${changes[i + 1][1]},${changes[i + 2][1]},${change}`;
      if (sequences.has(sequence)) {
        return;
      }
      sequences.add(sequence);
      totals.set(sequence, (totals.get(sequence) ?? 0) + price);
    });
  });
  return Math.max(...totals.values());
};
