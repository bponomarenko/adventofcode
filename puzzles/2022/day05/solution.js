export const formatInput = input => {
  const [rawStacks, moves] = input.split('\n\n');
  // Parse first part of the input (ditch the last line with indexes)
  const stackLines = rawStacks.split('\n').slice(0, -1);
  const stacksCount = (stackLines.at(-1).length + 1) / 4;
  // Prepare empty stacks as two-dimensional array
  const stacks = new Array(stacksCount).fill(0).map(() => []);

  // Fill the stacks from the input
  stackLines.forEach(line => {
    for (let i = 0; i < stacksCount; i += 1) {
      if (line[i * 4] === '[') {
        stacks[i].push(line[i * 4 + 1]);
      }
    }
  });

  return [
    stacks,
    // Parse second part of the input
    moves.split('\n').map(line => {
      const [, count, , from, , to] = line.split(' ');
      return [count, from - 1, to - 1];
    }),
  ];
};

const crateMover = (stacks, moves, reverse) => {
  moves.forEach(([count, from, to]) => {
    const toMove = stacks[from].splice(0, count);
    stacks[to].unshift(...(reverse ? toMove.reverse() : toMove));
  });
  return stacks.map(([first]) => first).join('');
};

export const part1 = input => crateMover(...input, true);

export const part2 = input => crateMover(...input);
