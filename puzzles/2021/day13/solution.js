export const formatInput = input => {
  const [coords, folds] = input.split('\n\n');
  return {
    coords: coords.split('\n').map(line => line.split(',').map(Number)),
    folds: folds.split('\n').map(line => {
      const [axis, value] = line.split(' ').pop().split('=');
      return [axis, +value];
    }),
  };
};

const fold = (coords, [axis, index]) => coords
  .map(([x, y]) => {
    if (axis === 'y') {
      if (y === index) {
        return null;
      }
      if (y > index) {
        return [x, 2 * index - y];
      }
    } else {
      if (x === index) {
        return null;
      }
      if (x > index) {
        return [2 * index - x, y];
      }
    }
    return [x, y];
  })
  .filter(Boolean);

export const part1 = ({ coords, folds }) => new Set(fold(coords, folds[0]).map(coord => coord.join('='))).size;

export const part2 = ({ coords, folds }) => {
  // Do the folds
  folds.forEach(foldBy => {
    coords = fold(coords, foldBy);
  });

  // fill the virtual map
  const map = [];
  coords.forEach(([x, y]) => {
    if (!map[y]) {
      map[y] = [];
    }
    map[y][x] = '#';
  });

  // print the letters
  map.forEach(line => {
    let str = '';
    for (let i = 0; i < line.length; i += 1) {
      str += line[i] || ' ';
    }
    console.log(str);
  });
};
