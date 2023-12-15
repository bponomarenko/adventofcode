export const formatInput = input => input.toGrid('\n', ' ');

const rules = {
  A: { wins: 'C', looses: 'B', score: 1 }, // rock
  B: { wins: 'A', looses: 'C', score: 2 }, // paper
  C: { wins: 'B', looses: 'A', score: 3 }, // scissors
};

const syn = { X: 'A', Y: 'B', Z: 'C' };

const play = (one, two) => {
  const { wins } = rules[one];
  let result = 3;
  if (two !== one) {
    result = two === wins ? 0 : 6;
  }
  return result + rules[two].score;
};

export const part1 = input => input.sum(([one, two]) => play(one, syn[two]));

const pickTwo = (one, result) => {
  const { wins, looses } = rules[one];
  if (result === 'X') {
    return wins;
  }
  return result === 'Y' ? one : looses;
};

export const part2 = input => input.sum(([one, two]) => play(one, pickTwo(one, two)));
