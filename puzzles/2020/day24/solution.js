const formatInput = input => input.split('\n');

const directionRe = /se|sw|nw|ne|e|w/g;

const part1 = input => {
  const tiles = new Map([]);

  input.forEach(direction => {
    const matches = direction.matchAll(directionRe);
    let pos = [0, 0, 0];

    for (const match of matches) {
      switch (match[0]) {
        case 'se':
          pos = [pos[0], pos[1] - 1, pos[2] + 1];
          break;
        case 'sw':
          pos = [pos[0] - 1, pos[1], pos[2] + 1];
          break;
        case 'nw':
          pos = [pos[0], pos[1] + 1, pos[2] - 1];
          break;
        case 'ne':
          pos = [pos[0] + 1, pos[1], pos[2] - 1];
          break;
        case 'e':
          pos = [pos[0] + 1, pos[1] - 1, pos[2]];
          break;
        case 'w':
          pos = [pos[0] - 1, pos[1] + 1, pos[2]];
          break;
        default:
          throw new Error('not expected');
      }
    }
    tiles.set(pos.join(','), !tiles.get(pos.join(',')));
  });
  return Array.from(tiles.values()).filter(Boolean).length;
};

const adjacentDirections = ['se', 'sw', 'nw', 'ne', 'w', 'e'];

const getPos = (ref, direction) => {
  switch (direction) {
    case 'se':
      return [ref[0], ref[1] - 1, ref[2] + 1];
    case 'sw':
      return [ref[0] - 1, ref[1], ref[2] + 1];
    case 'nw':
      return [ref[0], ref[1] + 1, ref[2] - 1];
    case 'ne':
      return [ref[0] + 1, ref[1], ref[2] - 1];
    case 'e':
      return [ref[0] + 1, ref[1] - 1, ref[2]];
    case 'w':
      return [ref[0] - 1, ref[1] + 1, ref[2]];
    default:
      throw new Error('not expected direction');
  }
};

const getLimits = (limits, pos) => [
  [Math.min(limits[0][0], pos[0]), Math.max(limits[0][1], pos[0])],
  [Math.min(limits[1][0], pos[1]), Math.max(limits[1][1], pos[1])],
  [Math.min(limits[2][0], pos[2]), Math.max(limits[2][1], pos[2])],
];

const part2 = input => {
  const tiles = new Map();
  const adjacentTiles = new Map();
  let limits = [[0, 0], [0, 0], [0, 0]];

  input.forEach(direction => {
    const matches = direction.matchAll(directionRe);
    let pos = [0, 0, 0];

    for (const match of matches) {
      pos = getPos(pos, match[0]);
    }
    tiles.set(pos.join(','), !tiles.get(pos.join(',')));
    limits = getLimits(limits, pos);
  });

  for (let day = 0; day < 100; day += 1) {
    const prevTiles = new Map(tiles);
    const prevLimits = Array.from(limits);

    for (let x = prevLimits[0][0] - 1; x <= prevLimits[0][1] + 1; x += 1) {
      for (let y = prevLimits[1][0] - 1; y <= prevLimits[1][1] + 1; y += 1) {
        for (let z = prevLimits[2][0] - 1; z <= prevLimits[2][1] + 1; z += 1) {
          const tile = [x, y, z];
          const tileHash = tile.join(',');

          let adjacent = adjacentTiles.get(tileHash);
          if (!adjacent) {
            adjacent = adjacentDirections.map(direction => getPos(tile, direction).join(','));
            adjacentTiles.set(tileHash, adjacent);
          }

          const count = adjacent.reduce((acc, at) => acc + (prevTiles.get(at) ? 1 : 0), 0);
          const isBlack = !!prevTiles.get(tileHash);
          if (isBlack && (count === 0 || count > 2)) {
            tiles.set(tileHash, false);
          } else if (!isBlack && count === 2) {
            tiles.set(tileHash, true);

            // Only update limits for border tiles, to speed up execution
            if (
              x === prevLimits[0][0] - 1
              || x === prevLimits[0][1] + 1
              || y === prevLimits[1][0] - 1
              || y === prevLimits[1][1] + 1
              || z === prevLimits[2][0] - 1
              || z === prevLimits[2][1] + 1
            ) {
              limits = getLimits(limits, tile);
            }
          }
        }
      }
    }
  }
  return Array.from(tiles.values()).filter(Boolean).length;
};

module.exports = { part1, part2, formatInput };
