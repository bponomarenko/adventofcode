const { formatInput } = require('./part1');

const main = input => {
  const indices = new Map();
  let lastNum;
  let turn;

  input.forEach((n, i) => {
    lastNum = n;
    turn = i;
    indices.set(lastNum, [-1, turn]);
  });

  while (turn < 30_000_000 - 1) {
    turn += 1;
    const [prevIndex, lastIndex] = indices.get(lastNum) || [];
    lastNum = prevIndex !== -1 ? lastIndex - prevIndex : 0;
    indices.set(lastNum, [indices.get(lastNum)?.[1] ?? -1, turn]);
  }
  return lastNum;
};

module.exports = { main: input => main(formatInput(input)) };
