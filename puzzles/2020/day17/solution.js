export const formatInput = input => input.split('\n').map(row => row.split('').map(cube => cube === '#'));

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
      dim[z] = new Array(y + 1).fill(0).map(() => new Array(x + 1).fill(false));
    }

    if (!dim[z][y]) {
      dim[z][y] = new Array(x + 1).fill(false);
    }
  }

  if (dim[z]?.[y]) {
    dim[z][y][x] = value;
  }
};

export const part1 = input => {
  const cycles = 6;
  const shift = 10;

  const z0 = Array.from(input);
  const dim = new Array(shift + 1).fill(0).map((_, z) => new Array(shift + z0.length).fill(0).map((__, y) => {
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

const countActive2 = (dim, limits) => {
  let count = 0;
  for (let w = (limits?.[0][0] ?? 0); w < (limits?.[0][1] ?? dim.length); w += 1) {
    const cube = dim[w] ?? [];
    for (let z = (limits?.[1][0] ?? 0); z < (limits?.[1][1] ?? dim.length); z += 1) {
      const slice = cube[z] ?? [];
      for (let y = (limits?.[2][0] ?? 0); y < (limits?.[2][1] ?? slice.length); y += 1) {
        const row = slice[y] ?? [];
        for (let x = (limits?.[3][0] ?? 0); x < (limits?.[3][1] ?? row.length); x += 1) {
          count += (row[x] ? 1 : 0);
        }
      }
    }
  }
  return count;
};

// eslint-disable-next-line max-len
const countActiveNeighbours2 = (dim, w, z, y, x) => countActive2(dim, [[w - 1, w + 2], [z - 1, z + 2], [y - 1, y + 2], [x - 1, x + 2]]) - (dim[w]?.[z]?.[y]?.[x] ? 1 : 0);

const setValue2 = (dim, w, z, y, x, value) => {
  if (value) {
    if (!dim[w]) {
      dim[w] = new Array(z + 1).fill(0).map(() => new Array(y + 1).fill(0).map(() => new Array(x + 1).fill(false)));
    }

    if (!dim[w][z]) {
      dim[w][z] = new Array(y + 1).fill(0).map(() => new Array(x + 1).fill(false));
    }

    if (!dim[w][z][y]) {
      dim[w][z][y] = new Array(x + 1).fill(false);
    }
  }

  if (dim[w]?.[z]?.[y]) {
    dim[w][z][y][x] = value;
  }
};

export const part2 = input => {
  const cycles = 6;
  const shift = 10;

  const z0 = Array.from(input);
  const dim = new Array(shift + 1)
    .fill(0)
    .map((_, w) => new Array(shift + 1).fill(0).map((__, z) => new Array(shift + z0.length).fill(0).map((___, y) => {
      const row = new Array(shift).fill(false);
      if (z === shift && w === shift) {
        if (y >= shift) {
          row.push(...z0[y - shift]);
        } else {
          row.push(...new Array(z0[0].length).fill(false));
        }
      }
      return row;
    })));

  const wBoxNext = [shift - 1, shift + 2];
  const zBoxNext = [shift - 1, shift + 2];
  const yBoxNext = [shift - 1, shift + z0.length + 1];
  const xBoxNext = [shift - 1, shift + z0[0].length + 1];

  for (let i = 0; i < cycles; i += 1) {
    const dimClone = dim.map(cube => cube.map(slice => slice.map(row => [...row])));
    const wBox = [...wBoxNext];
    const zBox = [...zBoxNext];
    const yBox = [...yBoxNext];
    const xBox = [...xBoxNext];

    for (let w = wBox[0]; w < wBox[1]; w += 1) {
      for (let z = zBox[0]; z < zBox[1]; z += 1) {
        for (let y = yBox[0]; y < yBox[1]; y += 1) {
          for (let x = xBox[0]; x < xBox[1]; x += 1) {
            const active = countActiveNeighbours2(dimClone, w, z, y, x);
            const value = dimClone[w]?.[z]?.[y]?.[x] ? (active === 2 || active === 3) : active === 3;
            setValue2(dim, w, z, y, x, value);

            if (value) {
              if (w === wBox[0]) {
                wBoxNext[0] = wBox[0] - 1;
              } else if (w === wBox[1] - 1) {
                wBoxNext[1] = wBox[1] + 1;
              }

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
  }
  return countActive2(dim);
};
