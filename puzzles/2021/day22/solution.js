const lineRe = /^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/;

export const formatInput = input => input.split('\n').map(line => {
  const [, instr, x1, x2, y1, y2, z1, z2] = line.match(lineRe);
  return { on: instr === 'on', x: [+x1, +x2], y: [+y1, +y2], z: [+z1, +z2] };
});

// Make sure ranges are always specified from min to max
const normalize = steps => steps.map(({ on, x, y, z }) => {
  if (x[0] > x[1]) {
    x.reverse();
  }
  if (y[0] > y[1]) {
    y.reverse();
  }
  if (y[0] > y[1]) {
    y.reverse();
  }
  return { on, x, y, z };
});

// Checks if two cuboid intersecting
const intersecting = (c1, c2) => c2.x[0] <= c1.x[1]
  && c1.x[0] <= c2.x[1]
  && c2.y[0] <= c1.y[1]
  && c1.y[0] <= c2.y[1]
  && c2.z[0] <= c1.z[1]
  && c1.z[0] <= c2.z[1];

// Returns intersection between two cuboids
const intersection = (c1, c2) => ({
  x: [c1.x[0] < c2.x[0] ? c2.x[0] : c1.x[0], c1.x[1] < c2.x[1] ? c1.x[1] : c2.x[1]],
  y: [c1.y[0] < c2.y[0] ? c2.y[0] : c1.y[0], c1.y[1] < c2.y[1] ? c1.y[1] : c2.y[1]],
  z: [c1.z[0] < c2.z[0] ? c2.z[0] : c1.z[0], c1.z[1] < c2.z[1] ? c1.z[1] : c2.z[1]],
});

// Splits original cuboid into a series of smaller cuboids, excluding cuboid area specified as a second parameter
const split = (cube, exclCube) => {
  const dx = [
    [cube.x[0], exclCube.x[0] - 1],
    [exclCube.x[0], exclCube.x[1]],
    [exclCube.x[1] + 1, cube.x[1]],
  ];
  const dy = [
    [cube.y[0], exclCube.y[0] - 1],
    [exclCube.y[0], exclCube.y[1]],
    [exclCube.y[1] + 1, cube.y[1]],
  ];
  const dz = [
    [cube.z[0], exclCube.z[0] - 1],
    [exclCube.z[0], exclCube.z[1]],
    [exclCube.z[1] + 1, cube.z[1]],
  ];

  const cubes = [];
  dx.forEach((x, ix) => {
    if (x[1] < x[0]) {
      return;
    }
    dy.forEach((y, iy) => {
      if (y[1] < y[0]) {
        return;
      }
      dz.forEach((z, iz) => {
        if (z[1] < z[0] || (ix === 1 && iy === 1 && iz === 1)) {
          return;
        }
        cubes.push({ on: cube.on, x, y, z, split: true });
      });
    });
  });
  return cubes;
};

const reboot = input => {
  const steps = normalize(input);

  for (let i = 1; i < steps.length; i += 1) {
    const cube = steps[i];
    for (let j = 0; j < i; j += 1) {
      const prevCube = steps[j];

      // Adjust steps if two cuboids intersecting
      if (intersecting(cube, prevCube)) {
        if (cube.on) {
          // split current cube to only keep unique entries
          const cubes = split(cube, intersection(cube, prevCube));
          // Replace current cube with splitted sub-cubes
          steps.splice(i, 1, ...cubes);
          // Make sure with process small sub-cubes with the rest of the steps
          i -= 1;
          break;
        } else {
        // split one of the previous cubes
          const cubes = split(prevCube, intersection(cube, prevCube));
          // amount of the increase in steps size
          const increase = cubes.length - 1;
          // Replace previous cube with new sub-cubes set
          steps.splice(j, 1, ...cubes);
          // Advance by amount of newly added sub-cubes
          i += increase;
          j += increase;
        }
      }
    }

    if (!cube.on) {
      // Remove this cube as we only want to keep "on" cubes for the final calculation
      steps.splice(i, 1);
      i -= 1;
    }
  }
  return steps.reduce((acc, { x, y, z }) => acc + ((x[1] - x[0] + 1) * (y[1] - y[0] + 1) * (z[1] - z[0] + 1)), 0);
};

export const part1 = input => {
  // Get only cubes with ranges -50..50
  const filtered = input.filter(({ x, y, z }) => x[0] >= -50 && x[1] <= 50 && y[0] >= -50 && y[1] <= 50 && z[0] >= -50 && z[1] <= 50);
  return reboot(filtered);
};

// Full on!
export const part2 = input => reboot(input);
