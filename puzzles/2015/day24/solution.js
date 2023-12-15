export const formatInput = input => input;

function* weightGroups(weights, size, initialGroup = []) {
  for (let i = 0; i < weights.length; i += 1) {
    const group = initialGroup.concat(weights[i]);
    const groupSize = group.sum();

    if (groupSize === size) {
      // Found needed group
      yield group;
    } else if (groupSize < size) {
      // Add more items to the group
      yield* weightGroups(weights.slice(i + 1), size, group);
    }
  }
}

export const part1 = input => {
  const weights = input.split('\n').map(w => +w);
  const groupSize = weights.sum() / 3;
  let bestGroup;

  for (let group of weightGroups(weights, groupSize)) {
    if (!bestGroup || group.length < bestGroup.length || (group.length === bestGroup.length && group.power() < bestGroup.power())) {
      bestGroup = group;
    }
  }
  return bestGroup.power();
};

export const part2 = input => {
  const weights = input.split('\n').map(w => +w);
  const groupSize = weights.sum() / 4;
  let bestGroup;

  for (let group of weightGroups(weights, groupSize)) {
    if (!bestGroup || group.length < bestGroup.length || (group.length === bestGroup.length && group.power() < bestGroup.power())) {
      bestGroup = group;
    }
  }
  return bestGroup.power();
};
