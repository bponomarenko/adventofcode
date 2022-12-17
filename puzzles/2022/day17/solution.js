export const formatInput = input => input.split('').map(jet => (jet === '>' ? -1 : 1));

const shapes = [
  // horizontal line
  { shape: ['####'], width: 4, height: 1 },
  // cross
  { shape: ['.#.', '###', '.#.'], width: 3, height: 3 },
  // L-shape
  { shape: ['###', '#..', '#..'], width: 3, height: 3 },
  // vertical line
  { shape: ['#', '#', '#', '#'], width: 1, height: 4 },
  // square
  { shape: ['##', '##'], width: 2, height: 2 },
];

const playTetris = (jets, count) => {
  const emptyRow = '.......';
  const filledRow = '#######';
  const lastShape = shapes.length - 1;
  const lastJet = jets.length - 1;
  const grid = [emptyRow];
  const history = new Map();
  let gridShift = 0;
  let top = 0;
  let shapeN = 0;
  let pos = [0, 0];
  let jet = 0;

  const overlap = (shape, width, height, px, py) => {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (shape[y][x] === '#' && grid[y - gridShift + py]?.[x + px] === '#') {
          return true;
        }
      }
    }
    return false;
  };

  for (let i = 0; i < count; i += 1) {
    // Memoization is for the rescue
    const hash = `${shapeN}|${jet}|${grid.join('\n')}`;
    const [prevI, prevTop, prevGridShift] = history.get(hash) ?? [];
    const forward = prevI ? i - prevI : 0;
    if (forward > 0 && (i + forward < count)) {
      i += forward - 1;
      top += top - prevTop;
      gridShift += gridShift - prevGridShift;
      continue;
    }
    history.set(hash, [i, top, gridShift]);

    const { shape, width, height } = shapes[shapeN];
    // set initial position
    pos = [7 - width - 2, top + 3];

    // Move the shape until it settles
    for (; ;) {
      // 1. try to push by the jet
      const x = pos[0] + jets[jet];
      if (x >= 0 && x + width < 8 && !overlap(shape, width, height, x, pos[1])) {
        pos[0] = x;
      }
      jet = jet === lastJet ? 0 : jet + 1;

      // 2. try to fall down
      if (pos[1] === 0 || overlap(shape, width, height, pos[0], pos[1] - 1)) {
        break;
      }
      pos[1] -= 1;
    }

    // 3. place the shape in the grid
    let addRows = pos[1] + height - gridShift - grid.length;
    while (addRows > 0) {
      grid.push(emptyRow);
      addRows -= 1;
    }

    let shift = 0;
    for (let dy = pos[1] - gridShift, y = dy; y < dy + height; y += 1) {
      for (let x = pos[0]; x < pos[0] + width; x += 1) {
        if (grid[y][x] !== '#') {
          const row = grid[y].split('');
          row[x] = shape[y - dy][x - pos[0]];
          grid[y] = row.join('');
        }
      }
      if (grid[y] === filledRow) {
        shift = Math.max(shift, y);
      }
    }

    // 4. shift the grid if possible
    if (shift > 0) {
      gridShift += grid.splice(0, shift).length;
    }

    // 5. update indexes
    top = Math.max(top, pos[1] + height);
    shapeN = shapeN === lastShape ? 0 : shapeN + 1;
  }
  return top;
};

export const part1 = input => playTetris(input, 2022);

export const part2 = input => playTetris(input, 1000000000000);
