export const formatInput = input => input.split(',').map(Number);

const countFish = (input, steps) => {
  let groups = new Map();
  input.forEach(num => {
    groups.set(num, (groups.get(num) || 0) + 1);
  });

  for (let i = 0; i < steps; i += 1) {
    const changes = new Map();
    for (let [num, count] of groups) {
      if (num === 0) {
        changes.set(6, (changes.get(6) || 0) + count);
        changes.set(8, count);
      } else {
        changes.set(num - 1, (changes.get(num - 1) || 0) + count);
      }
    }
    groups = changes;
  }
  return Array.from(groups.values()).sum();
};

export const part1 = input => countFish(input, 80);

export const part2 = input => countFish(input, 256);
