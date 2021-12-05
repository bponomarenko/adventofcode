export const formatInput = input => input.split('\n').map((size, index) => ({ num: index, size: +size }));

const liters = 150;

export const part1 = async input => {
  const combos = [];
  const checks = [];

  const countCombinations = (containers, path = [], filtersLevel = 0) => {
    if (containers.length === 0) {
      return;
    }

    if (containers.length === 1) {
      if (filtersLevel + containers[0].size === liters) {
        combos.push([containers[0].num, ...path]);
      }
      return;
    }

    containers.forEach((container, index) => {
      const newLevel = container.size + filtersLevel;
      if (newLevel === liters) {
        combos.push([container.num, ...path]);
      } else if (newLevel < liters) {
        checks.push({ containers: containers.slice(index + 1), path: [container.num, ...path], filtersLevel: newLevel });
      }
    });
  };

  checks.push({ containers: input, path: [], filtersLevel: 0 });

  await new Promise(resolve => {
    const processChecks = () => {
      const check = checks.shift();
      if (!check) {
        resolve();
        return;
      }
      countCombinations(check.containers, check.path, check.filtersLevel);
      setTimeout(() => processChecks(), 1);
    };

    processChecks();
  });

  return new Set(combos.map(combo => combo.sort().join('-'))).size;
};

export const part2 = async input => {
  const combos = [];
  const checks = [];

  const countCombinations = (containers, path = [], filtersLevel = 0) => {
    if (containers.length === 0) {
      return;
    }

    if (containers.length === 1) {
      if (filtersLevel + containers[0].size === liters) {
        combos.push([containers[0].num, ...path]);
      }
      return;
    }

    containers.forEach((container, index) => {
      const newLevel = container.size + filtersLevel;
      if (newLevel === liters) {
        combos.push([container.num, ...path]);
      } else if (newLevel < liters) {
        checks.push({ containers: containers.slice(index + 1), path: [container.num, ...path], filtersLevel: newLevel });
      }
    });
  };

  checks.push({ containers: input, path: [], filtersLevel: 0 });

  await new Promise(resolve => {
    const processChecks = () => {
      const check = checks.shift();
      if (!check) {
        resolve();
        return;
      }
      countCombinations(check.containers, check.path, check.filtersLevel);
      setTimeout(() => processChecks(), 1);
    };

    processChecks();
  });

  const sorted = combos.sort((c1, c2) => c1.length - c2.length);
  return sorted.findIndex(combo => combo.length > sorted[0].length);
};
