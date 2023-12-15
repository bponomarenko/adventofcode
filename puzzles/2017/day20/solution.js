import { getDistance } from '../../utils/grid.js';

const parseValues = str => str.slice(str.indexOf('<') + 1, str.indexOf('>')).split(',').map(Number);

export const formatInput = input => input.split('\n').map((line, i) => {
  const [coord, vel, acc] = line.split(', ');
  return { i, p: parseValues(coord), v: parseValues(vel), a: parseValues(acc) };
});

export const part1 = input => input.map(({ a, i }) => [a.map(v => Math.abs(v)).sort((a1, a2) => a2 - a1), i])
  .sort(([a1], [a2]) => {
    if (a1[0] !== a2[0]) {
      return a1[0] - a2[0];
    }
    return a1[1] !== a2[1] ? a1[1] - a2[1] : a1[2] - a2[2];
  })[0][1];

const diffSign = (v1, v2) => (v2 > 0 && v1 <= 0) || (v2 < 0 && v1 >= 0);
const canChangeDirection = particles => particles.some(({ v, a }) => diffSign(v[0], a[0]) || diffSign(v[1], a[1]) || diffSign(v[2], a[2]));

const hasConvergingParticles = (particles, distances) => {
  let result = false;
  for (let [{ i: i1, p: p1 }, { i: i2, p: p2 }] of particles.combinations(2)) {
    const key = `${i1}-${i2}`;
    const distance = getDistance(p1, p2);
    result = result || distance < distances.get(key);
    distances.set(key, distance);
  }
  return result;
};

export const part2 = input => {
  const pos = new Map();
  const distances = new Map(Array.from(input.combinations(2), ([{ i: i1, p: p1 }, { i: i2, p: p2 }]) => [`${i1}-${i2}`, getDistance(p1, p2)]));
  let particles = input;

  do {
    particles.forEach(({ i, p, v, a }) => {
      p.forEach((_, pi) => {
        // update velocity
        v[pi] += a[pi];
        // update position
        p[pi] += v[pi];
      });
      const key = p.join(',');
      pos.set(key, (pos.get(key) || new Set()).add(i));
    });

    // Remove collided particles
    Array.from(pos.values()).forEach(collisions => {
      if (collisions.size > 1) {
        particles = particles.filter(({ i }) => !collisions.has(i));
      }
    });
    pos.clear();
  } while (canChangeDirection(particles) || hasConvergingParticles(particles, distances));

  return particles.length;
};
