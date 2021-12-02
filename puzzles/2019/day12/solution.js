const formatInput = input => {
  const [steps, ...positions] = input.split('\n');
  return {
    steps: +steps,
    moons: positions.flatMap(position => position
      .slice(1, -1)
      .split(', ')
      .map(coord => +coord.split('=')[1])
      .concat([0, 0, 0])),
  };
};

// There are always 4 of them
const countMoons = 4;
// Size is always 6 – three coordinates and three velocity values
const moonSize = 6;
// Total size of the array
const size = countMoons * moonSize;

const updateCoordVelocity = (moons, coordA, coordB) => {
  const a = moons[coordA];
  const b = moons[coordB];
  if (a !== b) {
    const delta = a > b ? -1 : 1;
    moons[coordA + 3] += delta;
    moons[coordB + 3] += -delta;
  }
};

const updateVelocity = (moons, aIndex, bIndex) => {
  // Update x coordinate velocity
  updateCoordVelocity(moons, aIndex, bIndex);
  // Update y coordinate velocity
  updateCoordVelocity(moons, aIndex + 1, bIndex + 1);
  // Update z coordinate velocity
  updateCoordVelocity(moons, aIndex + 2, bIndex + 2);
};

const applyVelocity = moon => {
  for (let i = 0; i < size; i += moonSize) {
    moon[i] += moon[i + 3];
    moon[i + 1] += moon[i + 4];
    moon[i + 2] += moon[i + 5];
  }
};

const sum = values => values.reduce((acc, value) => acc + Math.abs(value), 0);

const getMoonEnergy = moon => sum(moon.slice(0, 3)) * sum(moon.slice(3));

const part1 = ({ steps, moons }) => {
  for (let s = 0; s < steps; s += 1) {
    // 1. Update velocity
    for (let i = 0; i < size - moonSize; i += moonSize) {
      for (let j = i + moonSize; j < size; j += moonSize) {
        updateVelocity(moons, i, j);
      }
    }
    // 2. Apply velocity
    applyVelocity(moons);
  }

  let totalEnergy = 0;
  for (let i = 0; i < size; i += moonSize) {
    totalEnergy += getMoonEnergy(moons.slice(i, i + moonSize));
  }
  return totalEnergy;
};

const part2 = ({ moons }) => {
  console.log(moons);
  return null;
};

module.exports = { part1, part2, formatInput };
