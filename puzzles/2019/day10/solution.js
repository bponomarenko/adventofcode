import { getDistance } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(row => row.split(''));

const findStationVisibleAsteroids = input => {
  const asteroids = input.flatMap((row, y) => row.map((char, x) => (char === '#' ? [x, y] : null)).filter(Boolean));
  let asteroidAngles;
  let center;

  for (let i = 0; i < asteroids.length; i += 1) {
    const [cx, cy] = asteroids[i];
    const angles = new Map();
    for (let j = 0; j < asteroids.length; j += 1) {
      if (i === j) {
        continue;
      }
      const [x, y] = asteroids[j];
      const dx = x - cx;
      const dy = y - cy;

      // calculate angle between vector to the target asteroid and vector to the North
      let deg;
      if (dy === 0) {
        deg = dx > 0 ? 90 : 270;
      } else if (dx === 0) {
        deg = dy > 0 ? 0 : 180;
      } else {
        // eslint-disable-next-line no-nested-ternary
        const shift = dy < 0 ? 180 : (dx > 0 ? 0 : 360);
        deg = (Math.atan(dx / dy) * 180) / Math.PI + shift;
      }
      angles.set(deg, (angles.get(deg) ?? []).concat([[x, y]]));
    }

    if (!asteroidAngles || angles.size > asteroidAngles.size) {
      asteroidAngles = angles;
      center = [cx, cy];
    }
  }
  return [asteroidAngles, center];
};

export const part1 = input => findStationVisibleAsteroids(input)[0].size;

export const part2 = input => {
  const [asteroidAnges, center] = findStationVisibleAsteroids(input);
  const asteroidsByAngle = Array.from(asteroidAnges.entries())
    .sort(([deg1], [deg2]) => deg1 - deg2)
    .map(([deg, asteroids]) => [
      deg,
      asteroids.sort((a1, a2) => getDistance(center, a2) - getDistance(center, a1)),
    ]);

  let lastAsteroid = [0, 0];
  // shoot asteroids
  return lastAsteroid[0] * 100 + lastAsteroid[1];
};
