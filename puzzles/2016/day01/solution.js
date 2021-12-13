export const formatInput = input => input.split(', ');

const move = (coord, direction, count) => {
  switch (direction) {
    case 'N':
      return [coord[0], coord[1] + count];
    case 'S':
      return [coord[0], coord[1] - count];
    case 'E':
      return [coord[0] + count, coord[1]];
    case 'W':
      return [coord[0] - count, coord[1]];
  }
  throw new Error(`Unexpected direction: ${direction}`);
};

export const part1 = input => {
  const directions = ['N', 'E', 'S', 'W'];
  let coord = [0, 0];
  let direction = 'N';

  input.forEach(step => {
    direction = directions[(directions.indexOf(direction) + (step[0] === 'R' ? 1 : -1) + 4) % 4];
    coord = move(coord, direction, +step.slice(1));
  });
  return Math.abs(coord[0]) + Math.abs(coord[1]);
};

const lineToVectors = line => {
  const directions = ['U', 'R', 'D', 'L'];
  let start = [0, 0];
  let direction = 'U';

  return line.map(instr => {
    direction = directions[(directions.indexOf(direction) + (instr[0] === 'R' ? 1 : -1) + 4) % 4];

    const delta = +instr.slice(1);
    let vector;
    switch (direction) {
      case 'R':
        vector = [start, [start[0] + delta, start[1]], 'h'];
        break;
      case 'L':
        vector = [start, [start[0] - delta, start[1]], 'h'];
        break;
      case 'U':
        vector = [start, [start[0], start[1] + delta], 'v'];
        break;
      case 'D':
        vector = [start, [start[0], start[1] - delta], 'v'];
        break;
    }
    [, start] = vector;
    return vector;
  });
};

const getIntersections = line => {
  const res = [];
  for (let i = 0; i < line.length; i += 1) {
    const vec1 = line[i];
    for (let j = i + 1; j < line.length; j += 1) {
      const vec2 = line[j];
      // if perpendicular
      if (vec1[2] !== vec2[2]) {
        const [ver, hor] = vec1[2] === 'v' ? [vec1, vec2] : [vec2, vec1];
        // if intersect
        if (
          ver[0][0] > Math.min(hor[0][0], hor[1][0])
            && ver[0][0] < Math.max(hor[0][0], hor[1][0])
            && hor[0][1] > Math.min(ver[0][1], ver[1][1])
            && hor[0][1] < Math.max(ver[0][1], ver[1][1])) {
          res.push([ver[0][0], hor[0][1]]);
        }
      }
    }
  }
  return res;
};

export const part2 = input => {
  const line = lineToVectors(input);
  return Math.min(...getIntersections(line).map(([x, y]) => Math.abs(x) + Math.abs(y)).filter(Boolean));
};
