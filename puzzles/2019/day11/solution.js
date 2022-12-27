import Intcode from '../intcode.js';

export const formatInput = input => input;

const directions = ['u', 'r', 'd', 'l', 'u'];

const paintHull = (input, whitePanels) => {
  const intcode = new Intcode(input, { autoRun: false });
  const painted = new Set();
  let x = 0;
  let y = 0;
  let dir = 'u';

  while (!intcode.halted) {
    const hash = `${x},${y}`;
    if (intcode.run(whitePanels.has(hash) ? 1 : 0).lastOutput) {
      whitePanels.add(hash);
    } else {
      whitePanels.delete(hash);
    }
    painted.add(hash);

    // find direction to turn
    dir = directions[intcode.run().lastOutput ? directions.indexOf(dir) + 1 : directions.lastIndexOf(dir) - 1];
    // move
    switch (dir) {
      case 'u':
        y -= 1;
        break;
      case 'd':
        y += 1;
        break;
      case 'r':
        x += 1;
        break;
      case 'l':
        x -= 1;
        break;
    }
  }
  return painted.size;
};

export const part1 = input => paintHull(input, new Set());

export const part2 = input => {
  const whitePanels = new Set(['0,0']);
  paintHull(input, whitePanels);

  // print ASCII art with result this time
  const points = Array.from(whitePanels).map(point => {
    const [x, y] = point.split(',');
    return [+x, +y];
  });
  const xx = points.map(([x]) => x);
  const yy = points.map(([, y]) => y);
  for (let y = Math.min(...yy); y <= Math.max(...yy); y += 1) {
    let row = '';
    for (let x = Math.min(...xx); x <= Math.max(...xx); x += 1) {
      row += whitePanels.has(`${x},${y}`) ? '🟦' : '⬜️';
    }
    console.log(row);
  }
};
