const formatInput = input => input.split('\n').map(row => row.split('').map(cube => cube === '#'));

const countActive = (dim, limits) => {
  let count = 0;
  for (let z = (limits?.[0][0] ?? 0); z < (limits?.[0][1] ?? dim.length); z += 1) {
    const slice = dim[z] ?? [];
    for (let y = (limits?.[1][0] ?? 0); y < (limits?.[1][1] ?? slice.length); y += 1) {
      const row = slice[y] ?? [];
      for (let x = (limits?.[2][0] ?? 0); x < (limits?.[2][1] ?? row.length); x += 1) {
        count += (row[x] ? 1 : 0);
      }
    }
  }
  return count;
};

const countActiveNeighbours = (dim, z, y, x) => countActive(dim, [[z - 1, z + 2], [y - 1, y + 2], [x - 1, x + 2]]) - (dim[z]?.[y]?.[x] ? 1 : 0);

const setValue = (dim, z, y, x, value) => {
  if (value) {
    if (!dim[z]) {
      // eslint-disable-next-line no-param-reassign
      dim[z] = new Array(y + 1).fill(0).map(() => new Array(x + 1).fill(false));
    }

    if (!dim[z][y]) {
      // eslint-disable-next-line no-param-reassign
      dim[z][y] = new Array(x + 1).fill(false);
    }
  }

  if (dim[z]?.[y]) {
    // eslint-disable-next-line no-param-reassign
    dim[z][y][x] = value;
  }
};

const main = input => {
  const cycles = 6;
  const shift = 10;

  const z0 = Array.from(input);
  const dim = new Array(shift + 1).fill(0).map((_, z) => new Array(shift + z0.length).fill(0).map((_, y) => {
    const row = new Array(shift).fill(false);
    if (z === shift) {
      if (y >= shift) {
        row.push(...z0[y - shift]);
      } else {
        row.push(...new Array(z0[0].length).fill(false));
      }
    }
    return row;
  }));

  const zBoxNext = [shift - 1, shift + 2];
  const yBoxNext = [shift - 1, shift + z0.length + 1];
  const xBoxNext = [shift - 1, shift + z0[0].length + 1];

  for (let i = 0; i < cycles; i += 1) {
    const dimClone = dim.map(slice => slice.map(row => [...row]));
    const zBox = [...zBoxNext];
    const yBox = [...yBoxNext];
    const xBox = [...xBoxNext];

    for (let z = zBox[0]; z < zBox[1]; z += 1) {
      for (let y = yBox[0]; y < yBox[1]; y += 1) {
        for (let x = xBox[0]; x < xBox[1]; x += 1) {
          const active = countActiveNeighbours(dimClone, z, y, x);
          const value = dimClone[z]?.[y]?.[x] ? (active === 2 || active === 3) : active === 3;
          setValue(dim, z, y, x, value);

          if (value) {
            if (z === zBox[0]) {
              zBoxNext[0] = zBox[0] - 1;
            } else if (z === zBox[1] - 1) {
              zBoxNext[1] = zBox[1] + 1;
            }

            if (y === yBox[0]) {
              yBoxNext[0] = yBox[0] - 1;
            } else if (y === yBox[1] - 1) {
              yBoxNext[1] = yBox[1] + 1;
            }

            if (x === xBox[0]) {
              xBoxNext[0] = xBox[0] - 1;
            } else if (x === xBox[1] - 1) {
              xBoxNext[1] = xBox[1] + 1;
            }
          }
        }
      }
    }
  }
  return countActive(dim);
};

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
};
