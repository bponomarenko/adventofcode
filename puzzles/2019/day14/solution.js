const parseChemical = chemical => {
  const [value, name] = chemical.split(' ');
  return [name, +value];
};

export const formatInput = input => {
  const entries = input.split('\n').map(line => {
    const [inputs, output] = line.split(' => ');
    const [name, count] = parseChemical(output);
    return [name, { count, inputs: inputs.split(', ').map(parseChemical) }];
  });
  return Object.fromEntries(entries);
};

const getProductionCosts = (name, count, reactions, remaining) => {
  const remains = remaining[name];
  if (remains > 0) {
    remaining[name] = Math.max(remains - count, 0);
    count = count > remains ? count - remains : 0;
  }
  if (name === 'ORE' || count === 0) {
    return count;
  }

  const mul = Math.ceil(count / reactions[name].count);
  remaining[name] = reactions[name].count * mul - count;
  return reactions[name].inputs
    .reduce((acc, [chemName, chemCount]) => acc + getProductionCosts(chemName, chemCount * mul, reactions, remaining), 0);
};

export const part1 = input => getProductionCosts('FUEL', 1, input, {});

export const part2 = input => {
  const remaining = { ORE: 1000000000000 };
  let cost = 0;
  let count = 0;
  while (!cost) {
    count += 1;
    cost = getProductionCosts('FUEL', 1, input, remaining);
  }
  return count - 1;
};
