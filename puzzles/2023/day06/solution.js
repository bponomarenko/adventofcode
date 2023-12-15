export const formatInput = input => input.split('\n').map(line => line.split(':')[1].split(' ').filter(Boolean).map(Number));

const countPossibleWins = (time, distance) => {
  const p1 = time / 2;
  const p2 = Math.sqrt(time ** 2 - 4 * distance) / 2;
  return Math.ceil(p1 + p2) - Math.floor(p1 - p2) - 1;
};

export const part1 = ([times, distances]) => times.power((time, index) => countPossibleWins(time, distances[index]));

export const part2 = ([times, distances]) => countPossibleWins(+times.join(''), +distances.join(''));
