export const formatInput = input => input;

const sum = weights => weights.reduce((acc, weight) => acc + weight, 0);
const prod = weights => weights.reduce((acc, weight) => acc * weight, 1);

function* weightGroups(weights, size, initialGroup = []) {
  for (let i = 0; i < weights.length; i += 1) {
    const group = initialGroup.concat(weights[i]);
    const groupSize = sum(group);

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
  const groupSize = sum(weights) / 3;
  let bestGroup;

  for (let group of weightGroups(weights, groupSize)) {
    if (!bestGroup || group.length < bestGroup.length || (group.length === bestGroup.length && prod(group) < prod(bestGroup))) {
      bestGroup = group;
    }
  }
  return prod(bestGroup);
};

export const part2 = input => {
  const weights = input.split('\n').map(w => +w);
  const groupSize = sum(weights) / 4;
  let bestGroup;

  for (let group of weightGroups(weights, groupSize)) {
    if (!bestGroup || group.length < bestGroup.length || (group.length === bestGroup.length && prod(group) < prod(bestGroup))) {
      bestGroup = group;
    }
  }
  return prod(bestGroup);
};
