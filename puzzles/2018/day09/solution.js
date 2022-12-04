export const formatInput = input => input.match(/^([0-9]+) players; last marble is worth ([0-9]+) points$/).slice(1, 3).map(Number);

const getPos = (length, cur, shift) => {
  const pos = cur + shift;
  if (pos >= length) {
    return length - pos;
  }
  return pos <= 0 ? length + pos : pos;
};

const play = (players, maxMarble) => {
  const scores = new Map();
  const marbles = [0, 2, 1];
  let pos = 1;
  let dec = 0;

  for (let i = marbles.length; i <= maxMarble; i += 1) {
    if (i % 23 === 0) {
      // Special case
      pos = getPos(i - dec, pos, -7);
      const score = i + marbles[pos];
      const player = i % players;
      scores.set(player, (scores.get(player) ?? 0) + score);
      marbles.splice(pos, 1);
      dec += 2;
    } else {
      pos = getPos(i - dec, pos, 2);
      marbles.splice(pos, 0, i);
    }
  }
  return Math.max(...Array.from(scores.values()));
};

export const part1 = ([players, maxMarble]) => play(players, maxMarble);

export const part2 = ([players, maxMarble]) => play(players, maxMarble * 100);
