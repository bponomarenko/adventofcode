// eslint-disable-next-line max-classes-per-file
const { formatInput } = require('./part1');

const row2num = (row, rev) => {
  const mappedRow = row.map(pixel => (pixel === '#' ? '1' : '0'));
  if (rev) {
    mappedRow.reverse();
  }
  return parseInt(mappedRow.join(''), 2);
};

const orientations = ['xy', 'rxy', 'xry', 'rxry', 'yx', 'yrx', 'ryx', 'ryrx'];

const getOrientation = (xt, xb, yl, yr, rx, ry) => [
  row2num(ry ? xb : xt, rx),
  row2num(rx ? yl : yr, ry),
  row2num(ry ? xt : xb, rx),
  row2num(rx ? yr : yl, ry),
];

const getOrientationR = (xt, xb, yl, yr, rx, ry) => getOrientation(yr, yl, Array.from(xt).reverse(), Array.from(xb).reverse(), rx, ry);

class Tile {
  constructor(image) {
    this.image = image;
  }

  getImage(orientation) {
    let image = this.image.map(row => Array.from(row));
    if (orientation.startsWith('y') || orientation.startsWith('ry')) {
      const newImage = [];
      for (let y = 0; y < image.length; y += 1) {
        newImage.push([]);
        for (let x = 0; x < image.length; x += 1) {
          newImage[y].push(image[x][image.length - 1 - y]);
        }
      }
      image = newImage;
    }

    if (orientation.includes('ry')) {
      image.reverse();
    }

    if (orientation.includes('rx')) {
      image.forEach(row => row.reverse());
    }
    return image;
  }
}

class SmallTile extends Tile {
  constructor(id, image) {
    super(image);
    this.id = id;

    const size = image.length;
    const xt = image[0];
    const xb = image[size - 1];
    const yl = image.map(row => row[0]);
    const yr = image.map(row => row[size - 1]);

    this.orientations = {
      xy: getOrientation(xt, xb, yl, yr, false, false),
      rxy: getOrientation(xt, xb, yl, yr, true, false),
      xry: getOrientation(xt, xb, yl, yr, false, true),
      rxry: getOrientation(xt, xb, yl, yr, true, true),

      yx: getOrientationR(xt, xb, yl, yr, false, false),
      yrx: getOrientationR(xt, xb, yl, yr, true, false),
      ryx: getOrientationR(xt, xb, yl, yr, false, true),
      ryrx: getOrientationR(xt, xb, yl, yr, true, true),
    };
  }

  get sides() {
    const sidesSet = new Set(Object.values(this.orientations).flatMap(v => v));
    return Array.from(sidesSet);
  }

  countMatchingSides(tile) {
    const matchingSides = this.sides.filter(id => tile.sides.includes(id));
    return [matchingSides.length, tile.id];
  }

  getOrientations(leftSide, topSide) {
    return orientations.filter(orientation => (!leftSide || leftSide === this.getSide(orientation, 3))
      && (!topSide || topSide === this.getSide(orientation, 0)));
  }

  getSide(orientation, sideIndex) {
    return this.orientations[orientation][sideIndex];
  }

  getTrimmedImage(orientation) {
    const image = this.getImage(orientation);
    return image.slice(1, -1).map(row => row.slice(1, -1));
  }
}

const findCorrectField = (tiles, field, y = 0, x = 0) => {
  const lastFieldIndex = field.length - 1;
  const matchingSidesCount = 4 - (y === 0 || y === lastFieldIndex ? 1 : 0) - (x === 0 || x === lastFieldIndex ? 1 : 0);

  const fieldOptions = tiles
    .flatMap(([tile, count, ids]) => {
      if (matchingSidesCount != count) {
        return null;
      }

      const leftTile = field[y][x - 1];
      const topTile = field[y - 1]?.[x];
      if ((leftTile && !ids.includes(leftTile[0].id)) || (topTile && !ids.includes(topTile[0].id))) {
        return null;
      }

      return tile.getOrientations(leftTile?.[0].getSide(leftTile[1], 1), topTile?.[0].getSide(topTile[1], 2))
        .map(orientation => {
          const fieldClone = field.map(row => row.map(v => v && Array.from(v)));
          fieldClone[y][x] = [tile, orientation];
          return fieldClone;
        });
    })
    .filter(Boolean);

  if (!fieldOptions.length) {
    return null;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const fieldOption of fieldOptions) {
    const nextTiles = tiles.filter(([tile]) => tile.id !== fieldOption[y][x][0].id);
    if (!nextTiles.length) {
      return fieldOption;
    }
    const correctField = findCorrectField(nextTiles, fieldOption, x === lastFieldIndex ? y + 1 : y, x === lastFieldIndex ? 0 : x + 1);
    if (correctField) {
      return correctField;
    }
  }
};

const mergeTiles = field => {
  const map = [];
  field.forEach(row => {
    const imagesRow = row.map(([tile, variation]) => tile.getTrimmedImage(variation));
    const imageRowsCount = imagesRow[0].length;

    for (let i = 0; i < imageRowsCount; i += 1) {
      map.push(imagesRow.flatMap(image => image[i]));
    }
  });
  return map;
};

const monster = [
  '..................#.'.split(''),
  '#....##....##....###'.split(''),
  '.#..#..#..#..#..#...'.split(''),
];
const monsterNums = monster.map(row => row2num(row));

const main = input => {
  const tiles = input.map(rawTile => {
    const [idRow, ...imageRows] = rawTile.split('\n');
    return new SmallTile(+idRow.slice(4, -1), imageRows.map(row => row.split('')));
  });

  // Find information for each tile on how many tiles it can side with
  const tileWithMatches = tiles
    .map(tile => {
      const matchingTiles = tiles
        .map(tile2 => (tile.id !== tile2.id ? tile.countMatchingSides(tile2) : [0]))
        .filter(([count]) => count > 0);
      const tileIds = new Set(matchingTiles.map(([, id]) => id));
      return [tile, matchingTiles.length, Array.from(tileIds)];
    });

  // Assuming the field is a square
  const fieldSize = Math.sqrt(tileWithMatches.length);
  // Arranged field tiles
  const field = findCorrectField(tileWithMatches, new Array(fieldSize).fill(0).map(() => new Array(fieldSize).fill(null)));
  const map = mergeTiles(field);
  const seaMap = new Tile(map);

  for (let i = 0; i < orientations.length; i += 1) {
    const image = seaMap.getImage(orientations[i]);
    let countMonsters = 0;

    for (let dy = 0; dy <= image.length - monster.length; dy += 1) {
      for (let dx = 0; dx <= image[0].length - monster[0].length; dx += 1) {
        // eslint-disable-next-line no-bitwise
        if ([0, 1, 2].every(j => (row2num(image[dy + j].slice(dx, dx + monster[0].length)) & monsterNums[j]) === monsterNums[j])) {
          countMonsters += 1;
        }
      }
    }

    if (countMonsters > 0) {
      return map.reduce((acc, row) => acc + row.filter(pixel => pixel === '#').length, 0) - 15 * countMonsters;
    }
  }
  return 'Sea monsters not found';
};

module.exports = { main: input => main(formatInput(input)) };
