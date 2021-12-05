const re = /\w+:(\s\w+\s(?<capacity>-?\d+)),(\s\w+\s(?<durability>-?\d+)),(\s\w+\s(?<flavor>-?\d+)),(\s\w+\s(?<texture>-?\d+))/;
const re2 = /\w+:(\s\w+\s(?<capacity>-?\d+)),(\s\w+\s(?<durability>-?\d+)),(\s\w+\s(?<flavor>-?\d+)),(\s\w+\s(?<texture>-?\d+)),(\s\w+\s(?<calories>-?\d+))/;

export const formatInput = input => input.split('\n');

function* combinations(size, total) {
  if (size === 2) {
    for (let i = 0; i <= total; i += 1) {
      yield [i, total - i];
    }
  } else {
    for (let i = 0; i <= total; i += 1) {
      for (let combo of combinations(size - 1, total - i)) {
        yield [i, ...combo];
      }
    }
  }
}

export const part1 = input => {
  const ingridients = input.map(str => Object.entries(re.exec(str).groups).map(([prop, value]) => [prop, +value]));
  let max = 0;

  for (let combo of combinations(ingridients.length, 100)) {
    const points = new Map();
    ingridients.forEach((props, i) => {
      props.forEach(([name, prop]) => {
        points.set(name, (points.get(name) || 0) + combo[i] * prop);
      });
    });
    max = Math.max(max, Array.from(points.values()).reduce((acc, point) => acc * Math.max(point, 0), 1));
  }
  return max;
};

export const part2 = input => {
  const ingridients = input.map(str => Object.entries(re2.exec(str).groups).map(([prop, value]) => [prop, +value]));
  let max = 0;

  for (let combo of combinations(ingridients.length, 100)) {
    const points = new Map();
    ingridients.forEach((props, i) => {
      props.forEach(([name, prop]) => {
        points.set(name, (points.get(name) || 0) + combo[i] * prop);
      });
    });

    if (points.get('calories') === 500) {
      max = Math.max(max, Array.from(points.values()).reduce((acc, point) => acc * (point === 500 ? 1 : Math.max(point, 0)), 1));
    }
  }
  return max;
};
