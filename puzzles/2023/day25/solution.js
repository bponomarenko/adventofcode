export const formatInput = input => {
  const wires = new Map();
  input.split('\n').forEach(row => {
    const [from, to] = row.split(': ');
    if (!wires.has(from)) {
      wires.set(from, []);
    }
    to.split(' ').forEach(wire => {
      wires.get(from).push(wire);
      if (wires.has(wire)) {
        wires.get(wire).push(from);
      } else {
        wires.set(wire, [from]);
      }
    });
  });
  return wires;
};

const countGroupNodes = (graph, start, skipWires) => {
  const visited = new Set();
  const queue = [start];
  while (queue.length) {
    const comp = queue.pop();
    visited.add(comp);
    const next = graph.get(comp).filter(target => !visited.has(target) && skipWires[comp] !== target);
    queue.push(...next);
  }
  return visited.size;
};

export const part1 = input => {
  const components = Array.from(input.keys());
  const visitsMemo = new Map();
  components.forEach(comp => {
    const visited = new Set([comp]);
    const queue = [[comp, []]];

    while (queue.length) {
      const [item, path] = queue.shift();
      path.forEach(edge => {
        visitsMemo.set(edge, (visitsMemo.get(edge) ?? 0) + 1);
      });

      input.get(item).forEach(next => {
        if (visited.has(next)) {
          return;
        }
        visited.add(next);
        queue.push([next, path.concat([next, item].sort().join(','))]);
      });
    }
  });

  // 3 wires with most visits should be connecting two groups
  const skipWireEntries = Array.from(visitsMemo.entries())
    .sort(([, value1], [, value2]) => value2 - value1)
    .slice(0, 3)
    .flatMap(([wire]) => {
      const [node1, node2] = wire.split(',');
      return [[node1, node2], [node2, node1]];
    });
  const skipWires = Object.fromEntries(skipWireEntries);

  const group1 = countGroupNodes(input, components[0], skipWires);
  return group1 * (input.size - group1);
};

// There is no coding challenge for the part 2, yay :)
export const part2 = () => 'That\'s a wrap';
