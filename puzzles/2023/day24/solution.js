export const formatInput = input => input.split('\n').map(row => {
  const [pos, vel] = row.split(' @ ').map(part => part.split(', ').map(BigInt));
  return { pos, vel };
});

export const part1 = (input, isTest) => {
  const min = isTest ? 7 : 200000000000000;
  const max = isTest ? 27 : 400000000000000;
  const segments = input.map(({ pos, vel }) => [pos, pos.map((value, i) => value + vel[i]), vel]);
  let intersections = 0;

  for (let [[p1, p2, vel1], [p3, p4, vel2]] of segments.combinations(2)) {
    const x12Detla = p1[0] - p2[0];
    const x34Detla = p3[0] - p4[0];
    const y12Detla = p1[1] - p2[1];
    const y34Detla = p3[1] - p4[1];
    const divider = x12Detla * y34Detla - y12Detla * x34Detla;
    if (divider === 0n) {
      continue;
    }
    const xy12Delta = p1[0] * p2[1] - p1[1] * p2[0];
    const xy34Delta = p3[0] * p4[1] - p3[1] * p4[0];
    const x = (xy12Delta * x34Detla - x12Detla * xy34Delta) / divider;
    const y = (xy12Delta * y34Detla - y12Detla * xy34Delta) / divider;
    if (x >= min && x <= max && y >= min && y <= max && (y - p1[1]) / vel1[1] > 0n && (y - p3[1]) / vel2[1] > 0n) {
      intersections += 1;
    }
  }
  return intersections;
};

const getVelocity = velocities => {
  let possibleV = Array.from(new Array(2001), (_, i) => BigInt(i - 1000));
  Array.from(velocities.entries()).forEach(([velocity, positions]) => {
    if (positions.length < 2) {
      return;
    }
    possibleV = possibleV.filter(possible => {
      const divider = possible - velocity;
      return divider === 0n || (positions[0] - positions[1]) % divider === 0n;
    });
  });
  return possibleV[0];
};

export const part2 = input => {
  const velocitiesX = new Map();
  const velocitiesY = new Map();
  const velocitiesZ = new Map();

  input.forEach(({ pos, vel }) => {
    if (velocitiesX.has(vel[0])) {
      velocitiesX.get(vel[0]).push(pos[0]);
    } else {
      velocitiesX.set(vel[0], [pos[0]]);
    }
    if (velocitiesY.has(vel[1])) {
      velocitiesY.get(vel[1]).push(pos[1]);
    } else {
      velocitiesY.set(vel[1], [pos[1]]);
    }
    if (velocitiesZ.has(vel[2])) {
      velocitiesZ.get(vel[2]).push(pos[2]);
    } else {
      velocitiesZ.set(vel[2], [pos[2]]);
    }
  });

  const vel = [getVelocity(velocitiesX), getVelocity(velocitiesY), getVelocity(velocitiesZ)];
  const results = new Map();

  for (let [{ pos: p1, vel: v1 }, { pos: p2, vel: v2 }] of input.combinations(2)) {
    if (v1[0] === vel[0] || v2[0] === vel[0]) {
      continue;
    }
    const m1 = (v1[1] - vel[1]) / (v1[0] - vel[0]);
    const m2 = (v2[1] - vel[1]) / (v2[0] - vel[0]);
    const c1 = p1[1] - m1 * p1[0];
    const c2 = p2[1] - m2 * p2[0];
    if (m1 === m2) {
      continue;
    }
    const x = (c2 - c1) / (m1 - m2);
    const y = m1 * x + c1;
    const time = (x - p1[0]) / (v1[0] - vel[0]);
    const z = p1[2] + (v1[2] - vel[2]) * time;
    const result = x + y + z;

    if (!results.has(result)) {
      results.set(result, 1);
    } else {
      results.set(result, results.get(result) + 1);
    }
  }
  return Array.from(results.entries()).sort(([, c1], [, c2]) => c2 - c1)[0][0].toString();
};
