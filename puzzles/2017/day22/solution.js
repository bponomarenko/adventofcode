export const formatInput = input => {
  const lines = input.split('\n');
  const center = [(lines[0].length - 1) / 2, (lines.length - 1) / 2];
  const infectedNodes = new Map();
  lines.forEach((line, y) => line.split('').forEach((node, x) => {
    if (node === '#') {
      infectedNodes.set(`${x - center[0]},${y - center[1]}`, 'I');
    }
  }));
  return infectedNodes;
};

const directions = ['u', 'r', 'd', 'l'];

const getNextDirection = (dir, node) => {
  const dirI = directions.indexOf(dir);
  switch (node) {
    case 'I':
      return directions[(dirI + 1) % 4];
    case 'W':
      return dir;
    case 'F':
      return directions[(dirI + 2) % 4];
    default:
      return directions[(dirI + 3) % 4];
  }
};

const getNextPosition = ([x, y], dir) => {
  switch (dir) {
    case 'u':
      return [x, y - 1];
    case 'd':
      return [x, y + 1];
    case 'l':
      return [x - 1, y];
    case 'r':
      return [x + 1, y];
  }
  return [x, y];
};

export const part1 = infectedNodes => {
  let pos = [0, 0];
  let dir = 'u';
  let infections = 0;

  for (let i = 0; i < 10000; i += 1) {
    const key = pos.join(',');
    if (infectedNodes.has(key)) {
      infectedNodes.delete(key);
      dir = getNextDirection(dir, 'I');
    } else {
      infections += 1;
      infectedNodes.set(key, 'I');
      dir = getNextDirection(dir);
    }
    pos = getNextPosition(pos, dir);
  }
  return infections;
};

export const part2 = infectedNodes => {
  let pos = [0, 0];
  let dir = 'u';
  let infections = 0;

  for (let i = 0; i < 10000000; i += 1) {
    const key = pos.join(',');
    if (infectedNodes.has(key)) {
      const node = infectedNodes.get(key);
      switch (node) {
        case 'W':
          infections += 1;
          infectedNodes.set(key, 'I');
          break;
        case 'I':
          infectedNodes.set(key, 'F');
          break;
        case 'F':
          infectedNodes.delete(key);
          break;
      }
      dir = getNextDirection(dir, node);
    } else {
      infectedNodes.set(key, 'W');
      dir = getNextDirection(dir);
    }
    pos = getNextPosition(pos, dir);
  }
  return infections;
};
