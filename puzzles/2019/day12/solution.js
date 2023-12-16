export const formatInput = input => {
  const [positions, steps] = input.split('\n\n');
  return {
    steps: +steps,
    moons: positions.split('\n').map(position => ({
      pos: position.slice(1, -1).split(', ').map(coord => +coord.split('=')[1]),
      vel: [0, 0, 0],
    })),
  };
};

const getDelta = (value1, value2) => {
  if (value1 === value2) {
    return 0;
  }
  return value1 < value2 ? 1 : -1;
};

const applyGravity = (m1, m2) => {
  m1.pos.forEach((p1, i) => {
    const delta = getDelta(p1, m2.pos[i]);
    m1.vel[i] += delta;
    m2.vel[i] -= delta;
  });
};

export const part1 = ({ steps, moons }, isTest) => {
  const count = moons.length;
  steps = isTest ? steps : 1000;
  for (let s = 0; s < steps; s += 1) {
    for (let i1 = 0; i1 < count; i1 += 1) {
      // 1. Update velocity
      for (let i2 = i1 + 1; i2 < count; i2 += 1) {
        applyGravity(moons[i1], moons[i2]);
      }
      // 2. Apply velocity
      moons[i1].pos = moons[i1].pos.map((value, p) => value + moons[i1].vel[p]);
    }
  }
  return moons.sum(({ pos, vel }) => pos.sum(Math.abs) * vel.sum(Math.abs));
};

const getVelocityDiff = (positions, size) => {
  const result = new Array(size).fill(0);
  positions.forEach((p1, i1) => {
    for (let i2 = i1 + 1; i2 < size; i2 += 1) {
      const p2 = positions[i2];
      result[i1] += getDelta(p1, p2);
      result[i2] += getDelta(p2, p1);
    }
  });
  return result;
};

const findStepsAxis = positions => {
  const size = positions.length;
  const velocities = new Array(size).fill(0);
  const finish = velocities.join(',');

  let steps = 0;
  do {
    getVelocityDiff(positions, size).forEach((diff, i) => {
      velocities[i] += diff;
    });
    velocities.forEach((vel, i) => {
      positions[i] += vel;
    });

    steps += 1;
  } while (velocities.join(',') !== finish);
  return steps * 2;
};

export const part2 = ({ moons }) => [
  findStepsAxis(moons.map(({ pos }) => pos[0])),
  findStepsAxis(moons.map(({ pos }) => pos[1])),
  findStepsAxis(moons.map(({ pos }) => pos[2])),
].lcm();
