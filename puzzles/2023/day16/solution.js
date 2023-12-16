import { getRelativeCoord, changeDirection } from '../../utils/grid.js';

export const formatInput = input => input.toGrid();

const isOutOfBounds = (x, y, limits) => (x < limits[0][0] || x >= limits[0][1] || y < limits[1][0] || y >= limits[1][1]);

const countEnergizedTiles = (input, startBeam, limits) => {
  const energized = new Map();
  let beams = [startBeam];

  const markAsEnergized = (hash, dir) => {
    if (energized.has(hash)) {
      energized.get(hash).add(dir);
    } else {
      energized.set(hash, new Set([dir]));
    }
  };

  do {
    beams.forEach(beam => {
      const [x, y] = getRelativeCoord(beam.x, beam.y, beam.dir);
      if (isOutOfBounds(x, y, limits)) {
        beam.exited = true;
        return;
      }

      beam.x = x;
      beam.y = y;

      let { dir } = beam;
      const hash = `${x},${y}`;
      const onXAxis = dir === 'e' || dir === 'w';

      switch (input[y][x]) {
        case '\\':
          dir = changeDirection(dir, onXAxis ? 90 : -90);
          break;
        case '/':
          dir = changeDirection(dir, onXAxis ? -90 : 90);
          break;
        case '|':
          if (onXAxis) {
            // split the beam
            const newBeam = { x, y, dir: changeDirection(dir, -90) };
            if (!energized.get(hash)?.has(newBeam.dir)) {
              beams.push(newBeam);
              markAsEnergized(hash, newBeam.dir);
            }
            dir = changeDirection(dir, 90);
          }
          break;
        case '-':
          if (!onXAxis) {
            // split the beam
            const newBeam = { x, y, dir: changeDirection(dir, -90) };
            if (!energized.get(hash)?.has(newBeam.dir)) {
              beams.push(newBeam);
              markAsEnergized(hash, newBeam.dir);
            }
            dir = changeDirection(dir, 90);
          }
          break;
      }

      if (energized.get(hash)?.has(dir)) {
        beam.exited = true;
        return;
      }

      beam.dir = dir;
      markAsEnergized(hash, dir);
    });
    beams = beams.filter(({ exited }) => !exited);
  } while (beams.length);
  return energized.size;
};

export const part1 = input => countEnergizedTiles(input, { x: -1, y: 0, dir: 'e' }, [[0, input[0].length], [0, input.length]]);

export const part2 = input => {
  const maxY = input.length;
  const maxX = input[0].length;
  const limits = [[0, maxX], [0, maxY]];
  let max = 0;
  for (let y = 0; y < maxY; y += 1) {
    max = Math.max(
      max,
      countEnergizedTiles(input, { x: -1, y, dir: 'e' }, limits),
      countEnergizedTiles(input, { x: maxX, y, dir: 'w' }, limits),
    );
  }
  for (let x = 0; x < maxX; x += 1) {
    max = Math.max(
      max,
      countEnergizedTiles(input, { x, y: -1, dir: 's' }, limits),
      countEnergizedTiles(input, { x, y: maxY, dir: 'n' }, limits),
    );
  }
  return max;
};
