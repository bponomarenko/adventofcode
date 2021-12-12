export const formatInput = input => input.split('\n').map(path => path.split('-'));

const mapCaveSystem = caves => {
  const map = new Map();
  caves.forEach(([a, b]) => {
    let adjA = map.get(a);
    if (!adjA) {
      adjA = [];
      map.set(a, adjA);
    }
    adjA.push(b);

    let adjB = map.get(b);
    if (!adjB) {
      adjB = [];
      map.set(b, adjB);
    }
    adjB.push(a);
  });
  return map;
};

const isBigCave = cave => {
  const code = cave.charCodeAt(0);
  return code >= 65 && code <= 90;
};

const discoverPaths = (caveSystem, path) => {
  const lastCave = path.at(-1);
  if (lastCave === 'end') {
    // Finish!
    return [path];
  }
  return caveSystem
    .get(lastCave)
    .filter(cave => cave !== 'start' && (isBigCave(cave) || !path.includes(cave)))
    .flatMap(cave => discoverPaths(caveSystem, [...path, cave]));
};

export const part1 = input => {
  const caveSystem = mapCaveSystem(input);
  return discoverPaths(caveSystem, ['start']).length;
};

const discoverPaths2 = (caveSystem, path) => {
  const lastCave = path.caves.at(-1);
  if (lastCave === 'end') {
    // Finish!
    return [path];
  }
  return caveSystem
    .get(lastCave)
    .map(cave => {
      if (cave === 'start') {
        return null;
      }

      const nextPath = { ...path, caves: [...path.caves, cave] };
      if (isBigCave(cave) || !path.caves.includes(cave)) {
        return nextPath;
      }
      if (!path.visitedSmallCave) {
        // Allow to visit it once
        nextPath.visitedSmallCave = true;
        return nextPath;
      }
      return null;
    })
    .filter(Boolean)
    .flatMap(nextPath => discoverPaths2(caveSystem, nextPath));
};

export const part2 = input => {
  const caveSystem = mapCaveSystem(input);
  return discoverPaths2(caveSystem, { caves: ['start'] }).length;
};
