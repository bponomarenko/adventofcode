const parseChemical = chemical => {
  const [value, name] = chemical.split(' ');
  return [name.toLowerCase(), +value];
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
  if (name === 'ore' || count === 0) {
    return count;
  }

  const mul = Math.ceil(count / reactions[name].count);
  remaining[name] = reactions[name].count * mul - count;
  return reactions[name].inputs
    .sum(([chemName, chemCount]) => getProductionCosts(chemName, chemCount * mul, reactions, remaining));
};

export const part1 = input => getProductionCosts('fuel', 1, input, {});

export const part2 = input => {
  const remaining = { ore: 1000000000000 };
  const singleFuelCost = getProductionCosts('fuel', 1, input, {});
  let count = 0;
  let cost = 0;
  while (!cost) {
    const toBuild = Math.max(1, Math.floor(remaining.ore / singleFuelCost));
    cost = getProductionCosts('fuel', toBuild, input, remaining);
    count += toBuild;
  }
  return count - 1;
};
