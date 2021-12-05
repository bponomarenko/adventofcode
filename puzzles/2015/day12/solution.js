export const formatInput = input => input;

// eslint-disable-next-line no-use-before-define -- no way around it, we need recursion
const sumValues = values => values.reduce((acc, value) => acc + sum(value), 0);

const sum = json => {
  if (Array.isArray(json)) {
    return sumValues(json);
  }
  if (typeof json === 'object') {
    return sumValues(Object.values(json));
  }
  return typeof json === 'number' ? json : 0;
};

export const part1 = input => sum(JSON.parse(input));

// eslint-disable-next-line no-use-before-define -- no way around it, we need recursion
const sumValues2 = values => values.reduce((acc, value) => acc + sum2(value), 0);

const sum2 = json => {
  if (Array.isArray(json)) {
    return sumValues2(json);
  }
  if (typeof json === 'object') {
    const values = Object.values(json);
    return values.includes('red') ? 0 : sumValues2(values);
  }
  return typeof json === 'number' ? json : 0;
};

export const part2 = input => sum2(JSON.parse(input));
