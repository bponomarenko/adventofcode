const moveRe = /^move ([0-9]+) from ([0-9]+) to ([0-9]+)$/;

export const formatInput = input => {
  const [rawStacks, moves] = input.split('\n\n');
  const stackLines = rawStacks.split('\n').slice(0, -1);
  const stacksCount = (stackLines.at(-1).length + 1) / 4;
  const stacks = new Array(stacksCount).fill(0).map(() => []);

  stackLines.forEach(line => {
    for (let i = 0; i < stacksCount; i += 1) {
      if (line[i * 4] === '[') {
        stacks[i].push(line[i * 4 + 1]);
      }
    }
  });

  return {
    stacks,
    moves: moves.split('\n').map(line => {
      const [, count, from, to] = line.match(moveRe);
      return [count, from - 1, to - 1];
    }),
  };
};

const crateMover = (stacks, moves, reverse) => {
  moves.forEach(([count, from, to]) => {
    const toMove = stacks[from].splice(0, count);
    stacks[to].unshift(...(reverse ? toMove.reverse() : toMove));
  });
  return stacks.map(([first]) => first).join('');
};

export const part1 = input => {
  const { stacks, moves } = input;
  return crateMover(stacks, moves, true);
};

export const part2 = input => {
  const { stacks, moves } = input;
  return crateMover(stacks, moves);
};
