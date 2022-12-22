export const formatInput = input => {
  const [map, path] = input.split('\n\n');
  return [
    map.split('\n').map(line => line.replace('0', ' ').split('')),
    path.match(/(\d+)([LR]?)/g).flatMap(line => (line.endsWith('L') || line.endsWith('R') ? [+line.slice(0, -1), line.slice(-1)] : +line)),
  ];
};
formatInput.doNotTrim = true;

const directions = ['r', 'd', 'l', 'u', 'r'];

export const part1 = ([grid, path]) => {
  let x = grid[0].findIndex(tile => tile === '.');
  let y = 0;
  let dir = 'r';

  while (path.length) {
    let step = path.shift();

    // change direction
    if (step === 'L') {
      dir = directions[directions.lastIndexOf(dir) - 1];
      continue;
    } else if (step === 'R') {
      dir = directions[directions.indexOf(dir) + 1];
      continue;
    }

    // Do the move
    while (step > 0) {
      switch (dir) {
        case 'r':
          if (x + 1 >= grid[y].length) {
            const nextX = grid[y].findIndex(tile => tile !== ' ');
            if (grid[y][nextX] === '#') {
              step = 0;
            } else {
              x = nextX;
            }
          } else if (grid[y][x + 1] === '#') {
            step = 0;
          } else {
            x += 1;
          }
          break;
        case 'l':
          if (x - 1 < 0 || grid[y][x - 1] === ' ') {
            const nextX = grid[y].length - 1;
            if (grid[y][nextX] === '#') {
              step = 0;
            } else {
              x = nextX;
            }
          } else if (grid[y][x - 1] === '#') {
            step = 0;
          } else {
            x -= 1;
          }
          break;
        case 'd':
          if (y + 1 >= grid.length || x >= grid[y + 1].length) {
            const nextY = grid.findIndex(row => row[x] !== ' ');
            if (grid[nextY][x] === '#') {
              step = 0;
            } else {
              y = nextY;
            }
          } else if (grid[y + 1][x] === '#') {
            step = 0;
          } else {
            y += 1;
          }
          break;
        case 'u':
          if (y - 1 < 0 || grid[y - 1][x] === ' ') {
            const nextY = grid.findLastIndex(row => x < row.length);
            if (grid[nextY][x] === '#') {
              step = 0;
            } else {
              y = nextY;
            }
          } else if (grid[y - 1][x] === '#') {
            step = 0;
          } else {
            y -= 1;
          }
          break;
      }
      step -= 1;
    }
  }
  return 1000 * (y + 1) + 4 * (x + 1) + directions.indexOf(dir);
};

export const part2 = ([grid, path]) => {
  let x = grid[0].findIndex(tile => tile === '.');
  let y = 0;
  let dir = 'r';

  // dir = 'u';
  // path = [4];
  // x = 14;
  // y = 10;

  console.log('---', x, y);
  while (path.length) {
    // move
    let step = path.shift();
    // console.log([x, y], step, dir);

    // change direction
    if (step === 'L') {
      dir = directions[directions.lastIndexOf(dir) - 1];
      continue;
    } else if (step === 'R') {
      dir = directions[directions.indexOf(dir) + 1];
      continue;
    }

    // Do the move
    while (step > 0) {
      switch (dir) {
        case 'r':
          if (x + 1 >= grid[y].length) {
            const nextX = grid[y].findIndex(tile => tile !== ' ');
            // console.log('r', x, y, nextX, step);
            if (grid[y][nextX] === '#') {
              step = 0;
            } else {
              x = nextX;
            }
          } else if (grid[y][x + 1] === '#') {
            step = 0;
          } else {
            x += 1;
          }
          break;
        case 'l':
          if (x - 1 < 0 || grid[y][x - 1] === ' ') {
            const nextX = grid[y].length - 1;
            // console.log('l', x, y, nextX, step);
            if (grid[y][nextX] === '#') {
              step = 0;
            } else {
              x = nextX;
            }
          } else if (grid[y][x - 1] === '#') {
            step = 0;
          } else {
            x -= 1;
          }
          break;
        case 'd':
          if (y + 1 >= grid.length || x >= grid[y + 1].length) {
            const nextY = grid.findIndex(row => row[x] !== ' ');
            // console.log('d', x, y, nextY, step);
            if (grid[nextY][x] === '#') {
              step = 0;
            } else {
              y = nextY;
            }
          } else if (grid[y + 1][x] === '#') {
            step = 0;
          } else {
            y += 1;
          }
          break;
        case 'u':
          if (y - 1 < 0 || grid[y - 1][x] === ' ') {
            const nextY = grid.findLastIndex(row => x < row.length);
            // console.log('u', x, y, nextY, step);
            if (grid[nextY][x] === '#') {
              step = 0;
            } else {
              y = nextY;
            }
          } else if (grid[y - 1][x] === '#') {
            step = 0;
          } else {
            y -= 1;
          }
          break;
      }
      step -= 1;
    }
    // console.log('upd', x, y);
  }

  console.log(x, y, dir);
  return 1000 * (y + 1) + 4 * (x + 1) + directions.indexOf(dir);
};
