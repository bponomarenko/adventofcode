export const formatInput = input => {
  const walls = new Map();
  input.split('\n').forEach(row => {
    let [pos, range] = row.split(', ');
    pos = +pos.slice(2);
    range = range.slice(2).split('..').map(Number);

    const byY = row.startsWith('y');
    for (let i = range[0]; i <= range[1]; i += 1) {
      const coord = byY ? [i, pos] : [pos, i];
      walls.set(coord.join(','), coord[1]);
    }
  });
  return walls;
};

const findWaterTiles = walls => {
  const yValues = Array.from(walls.values());
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const springs = [[500, 0]];
  const waterTiles = new Map();

  while (springs.length > 0) {
    const [x, y] = springs.shift();

    // 1. Flow down till we can
    let floor = null;
    let dy = Math.max(y, minY);
    let hash = `${x},${dy}`;
    while (dy <= maxY && !waterTiles.has(hash)) {
      if (walls.has(hash)) {
        floor = dy;
        break;
      }
      waterTiles.set(hash, 0);
      dy += 1;
      hash = `${x},${dy}`;
    }

    if (floor === null) {
      if (dy > maxY) {
        // stream is flowing into the abbyss – done with this stream
        continue;
      } else {
        // We flow into existing pool - special case!
        floor = dy + 1;
      }
    }

    // 2. Fill the container until it starts overflow
    let rightWall;
    let leftWall;
    let level = floor;
    do {
      rightWall = null;
      leftWall = null;
      level -= 1;

      if (level <= y) {
        waterTiles.set(`${x},${level}`, 0);
      }

      // flow right first
      let dx = x + 1;
      while (walls.has(`${dx},${level + 1}`) || waterTiles.has(`${dx},${level + 1}`)) {
        if (walls.has(`${dx},${level}`)) {
          rightWall = dx;
          break;
        }
        waterTiles.set(`${dx},${level}`, 0);
        dx += 1;
      }

      if (rightWall === null && !waterTiles.has(`${dx},${level}`) && walls.has(`${dx - 1},${level + 1}`)) {
        // found a stream on the right
        springs.push([dx, level]);
      }

      // then flow left
      dx = x - 1;
      while (walls.has(`${dx},${level + 1}`) || waterTiles.has(`${dx},${level + 1}`)) {
        if (walls.has(`${dx},${level}`)) {
          leftWall = dx;
          break;
        }
        waterTiles.set(`${dx},${level}`, 0);
        dx -= 1;
      }

      if (leftWall === null && !waterTiles.has(`${dx},${level}`) && walls.has(`${dx + 1},${level + 1}`)) {
        // found a stream on the left
        springs.push([dx, level]);
      }

      if (leftWall !== null && rightWall !== null) {
        for (dx = leftWall + 1; dx < rightWall; dx += 1) {
          waterTiles.set(`${dx},${level}`, 1);
        }
      }
    } while (leftWall !== null && rightWall !== null);
  }
  return waterTiles;
};

export const part1 = input => findWaterTiles(input).size;

export const part2 = input => Array.from(findWaterTiles(input).values()).sum();
