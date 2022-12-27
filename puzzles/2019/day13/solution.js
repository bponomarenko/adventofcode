import Intcode from '../intcode.js';

export const formatInput = input => input;

export const part1 = input => new Intcode(input).output.filter((value, i) => (i + 1) % 3 === 0 && value === 2).length;

export const part2 = input => {
  const intcode = new Intcode(`2${input.slice(1)}`, { autoRun: false });
  let ball;
  let paddle;
  let score = -1;

  function* tiles() {
    let tile = [];
    while (!intcode.halted) {
      const value = intcode.run().lastOutput;
      if (tile.length === 2) {
        yield tile.concat(value);
        tile = [];
      } else {
        tile.push(value);
      }
    }
  }

  for (let [x, y, type] of tiles()) {
    if (x === -1 && y === 0) {
      score = type;
    } else if (type === 3) {
      paddle = [x, y];
    } else if (type === 4) {
      ball = [x, y];

      // the game is on once score is updated
      if (score !== -1) {
        // Just let paddle follow the ball
        if (ball[0] < paddle[0]) {
          intcode.input.push(-1);
        } else if (ball[0] > paddle[0]) {
          intcode.input.push(1);
        }
      }
    }
  }
  return score;
};
