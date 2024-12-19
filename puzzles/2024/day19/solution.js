export const formatInput = input => {
  const [towels, designs] = input.split('\n\n');
  return [towels.split(', '), designs.split('\n')];
};

const isPossibleDesign = (design, towels) => {
  let i = 0;
  while (i < towels.length) {
    const towel = towels[i];
    if (design === towel) {
      return true;
    }
    if (design.startsWith(towel) && isPossibleDesign(design.slice(towel.length), towels)) {
      return true;
    }
    i += 1;
  }
  return false;
};

export const part1 = ([towels, designs]) => designs.filter(design => isPossibleDesign(design, towels)).length;

const countPatterns = (design, towels, memory = new Map()) => {
  if (memory.has(design)) {
    return memory.get(design);
  }
  let i = 0;
  let sum = 0;
  while (i < towels.length) {
    const towel = towels[i];
    if (design === towel) {
      sum += 1;
    }
    if (design.startsWith(towel)) {
      sum += countPatterns(design.slice(towel.length), towels, memory);
    }
    i += 1;
  }
  memory.set(design, sum);
  return sum;
};

export const part2 = ([towels, designs]) => designs.sum(design => countPatterns(design, towels));
