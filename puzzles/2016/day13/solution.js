export const formatInput = input => +input;

const isFree = (x, y, code) => {
  const num = x * x + 3 * x + 2 * x * y + y + y * y + code;
  let i = 0;
  let count = 0;
  while (num >= 2 ** i) {
    count += (num >> i) & 1;
    i += 1;
  }
  return !(count & 1);
};

const getMoveOptions = (maze, visited, [x, y]) => [[x + 1, y], [x, y + 1], [x, y - 1], [x - 1, y]]
  .filter(option => maze[option[0]]?.[option[1]] && !visited.has(option.join(',')));

export const part1 = input => {
  const target = [39, 31];
  const size = 50;
  const maze = [];

  // Populate maze
  for (let y = 0; y <= size; y += 1) {
    maze.push([]);
    for (let x = 0; x <= size; x += 1) {
      maze[y].push(isFree(x, y, input));
    }
  }

  let start = [1, 1];
  let shortestPath = Infinity;
  let queue = [{ path: [start], visited: new Set([start.join(',')]) }];

  while (queue.length) {
    let { path, visited } = queue.shift();
    const options = getMoveOptions(maze, visited, path[path.length - 1]);
    if (options.find(option => option[0] === target[0] && option[1] === target[1])) {
      shortestPath = Math.min(shortestPath, path.length);
    }

    if (path.length >= shortestPath) {
      // Doesn't make sense to search for longer paths
      // eslint-disable-next-line no-continue
      continue;
    }

    options.forEach(option => {
      queue.push({
        path: [...path, option],
        visited: new Set([...visited, option.join(',')]),
      });
    });
  }
  return shortestPath;
};

export const part2 = input => {
  const size = 50;
  const maze = [];

  // Populate maze
  for (let y = 0; y <= size; y += 1) {
    maze.push([]);
    for (let x = 0; x <= size; x += 1) {
      maze[y].push(isFree(x, y, input));
    }
  }

  let start = [1, 1];
  let queue = [{ path: [start], visited: new Set([start.join(',')]) }];
  let locations = new Set([start.join(',')]);

  while (queue.length) {
    let { path, visited } = queue.shift();
    const options = getMoveOptions(maze, visited, path[path.length - 1]);
    options.forEach(option => {
      locations.add(option.join(','));
      if (path.length !== 50) {
        queue.push({
          path: [...path, option],
          visited: new Set([...visited, option.join(',')]),
        });
      }
    });
  }
  return locations.size;
};
