const formatInput = input => input.split('\n\n');

const row2num = row => parseInt(row.map(pixel => (pixel === '#' ? '1' : '0')).join(''), 2);

class Tile {
  constructor(id, image) {
    this.id = id;
    this.image = image;

    const sides = [
      Array.from(image[0]),
      image.map(row => row[row.length - 1]),
      Array.from(image[image.length - 1]),
      image.map(row => row[0]),
    ];

    this.variations = [sides.map(row2num)];

    sides[0].reverse();
    sides[2].reverse();
    [sides[1], sides[3]] = [sides[3], sides[1]];
    this.variations.push(sides.map(row2num));

    sides[1].reverse();
    sides[3].reverse();
    // eslint-disable-next-line no-self-assign
    [sides[0], sides[2]] = [sides[0], sides[2]];
    this.variations.push(sides.map(row2num));

    sides[0].reverse();
    sides[2].reverse();
    [sides[1], sides[3]] = [sides[3], sides[1]];
    this.variations.push(sides.map(row2num));
  }

  countMatchingSides(tile) {
    const matchingSides = new Set();
    this.variations.forEach(sides => sides.forEach(side => {
      if (tile.containsSide(side)) {
        matchingSides.add(side);
      }
    }));
    return matchingSides.size;
  }

  containsSide(side) {
    return this.variations.some(sides => sides.includes(side));
  }
}

const main = input => {
  const tiles = input.map(rawTile => {
    const [idRow, ...imageRows] = rawTile.split('\n');
    return new Tile(+idRow.slice(4, -1), imageRows.map(row => row.split('')));
  });

  return tiles
    .filter(tile => {
      const matchingTilesCount = tiles.map(tile2 => (tile.id !== tile2.id ? tile.countMatchingSides(tile2) : 0)).filter(Boolean).length;
      return matchingTilesCount <= 2;
    })
    .reduce((acc, tile) => acc * tile.id, 1);
};

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
};
