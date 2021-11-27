const { formatInput, mainFn } = require('./part1');

const findCorrectedWeight = (towers, name) => {
  const tower = towers.get(name);
  if (!tower.towersAbove) {
    // Since there are no towers above, sum is the same as tower's weight
    return null;
  }

  // Check if there are towers with more towers above them
  const subBranches = tower.towersAbove.filter(childName => !!towers.get(childName).towersAbove);
  // if there are – try to see if one of them requires correction
  for (let i = 0; i < subBranches.length; i += 1) {
    const correctedWeight = findCorrectedWeight(towers, subBranches[i]);
    if (correctedWeight != null) {
      return correctedWeight;
    }
  }

  // if no towers above requires correction, check if this tower requires correction?
  if (tower.sum == null) {
    // Compare sums
    const sumCounts = new Map();
    tower.towersAbove.forEach(childName => {
      const { sum } = towers.get(childName);
      sumCounts.set(sum, (sumCounts.get(sum) || 0) + 1);
    });

    if (sumCounts.size === 2) {
      // Entries will be an array, where first entry is a weight which requires correction
      const sums = Array.from(sumCounts.entries())
        .sort(([, count1], [, count2]) => count1 - count2)
        .map(([sum]) => sum);
      // This tower requires weight correction!
      const faultyTowerName = tower.towersAbove.find(childName => towers.get(childName).sum === sums[0]);
      return towers.get(faultyTowerName).weight + (sums[1] - sums[0]);
    }
    // Find sum of weights of all towers above
    tower.sum = tower.weight + (Array.from(sumCounts.keys())[0] * tower.towersAbove.length);
  }
  return null;
};

const main = input => {
  // Get root node from the first part
  const rootName = mainFn(input);
  const towers = new Map(input.map(tower => [tower.name, {
    ...tower,
    // Add sum to towers without towers above
    sum: tower.towersAbove ? null : tower.weight,
  }]));
  // Start recursive function to find corrected weight
  return findCorrectedWeight(towers, rootName);
};

module.exports = { main: input => main(formatInput(input)) };
