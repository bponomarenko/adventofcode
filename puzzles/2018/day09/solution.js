export const formatInput = input => input.match(/^(\d+) players; last marble is worth (\d+) points$/).slice(1, 3).map(Number);

const getPos = (length, cur, shift) => (cur + shift + length) % length;

const play = (players, maxMarble) => {
  const scores = new Array(players).fill(0);
  const marbles = [0, 2, 1];
  let length = marbles.length;
  let pos = 1;

  for (let i = length; i <= maxMarble; i += 1) {
    if (i % 23 === 0) {
      // Special case
      pos = getPos(length, pos, -7);
      scores[i % players] += i + marbles.splice(pos, 1)[0];
      length -= 1;
    } else {
      pos = getPos(length, pos, 2);
      marbles.splice(pos, 0, i);
      length += 1;
    }
  }
  return Math.max(...scores.filter(Boolean));
};

export const part1 = ([players, maxMarble]) => play(players, maxMarble);

export const part2 = ([players, maxMarble]) => play(players, maxMarble * 100);
