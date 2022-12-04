export const formatInput = input => input.split('\n').map(line => line.match(/^Step (.{1}) must be finished before step (.{1}) can begin.$/).slice(1, 3));

const buildTree = steps => {
  const deps = new Map();
  const roots = new Set();
  const children = new Set();

  steps.forEach(([parent, child]) => {
    children.add(child);
    roots.delete(child);
    if (!children.has(parent)) {
      roots.add(parent);
    }

    if (!deps.has(child)) {
      deps.set(child, new Set());
    }
    deps.get(child).add(parent);
  });
  return [deps, Array.from(roots)];
};

const findPath = (tree, workersCount, getDuration) => {
  const [deps, queue] = tree;
  let workers = new Array(workersCount).fill(null);
  let seconds = 0;
  let path = '';

  while (queue.length || workers.some(Boolean)) {
    queue.sort();

    workers = workers.map(worker => {
      let nextWorker = null;
      if (worker) {
        if (worker.ticks <= 1) {
          Array.from(deps.entries()).forEach(([child, parent]) => {
            if (parent.has(worker.node)) {
              parent.delete(worker.node);
            }
            if (parent.size === 0) {
              queue.push(child);
              deps.delete(child);
            }
          });
        } else {
          nextWorker = { ...worker, ticks: worker.ticks - 1 };
        }
      }

      if (!nextWorker) {
        const node = queue.shift();
        if (node) {
          path += node;
          nextWorker = { node, ticks: getDuration(node) };
        }
      }
      return nextWorker;
    });
    seconds += 1;
  }
  return [path, seconds - 1];
};

export const part1 = input => {
  const tree = buildTree(input);
  return findPath(tree, 1, () => 0)[0];
};

export const part2 = input => {
  const tree = buildTree(input);
  return findPath(tree, 5, step => step.charCodeAt(0) - 4)[1];
};
