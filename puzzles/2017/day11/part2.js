const { formatInput, getNextPos, getDistance } = require('./part1');

const main = input => {
  let pos = [0, 0, 0];
  let max = 0;
  input.forEach(dir => {
    pos = getNextPos(dir, pos);
    max = Math.max(max, getDistance(pos));
  });
  return max;
};

module.exports = { main: input => main(formatInput(input)) };
