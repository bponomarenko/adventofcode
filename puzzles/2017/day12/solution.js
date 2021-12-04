const addValues = (map, key, value) => {
  if (!map.has(key)) {
    map.set(key, new Set([value]));
  } else {
    map.get(key).add(value);
  }
};

export const formatInput = input => {
  const connections = new Map();
  input.split('\n').forEach(line => {
    const [id, targetIds] = line.split(' <-> ');
    targetIds.split(', ').forEach(targetId => {
      // Since programm connections are bi-directional, store both connections
      addValues(connections, +id, +targetId);
      addValues(connections, +targetId, +id);
    });
  });
  return connections;
};

const getGroupIds = (connections, firstId) => {
  const queue = [firstId];
  const connectedPrograms = new Set();

  // Find all programs connected to program with id "0"
  while (queue.length > 0) {
    const id = queue.pop();
    if (!connectedPrograms.has(id)) {
      connectedPrograms.add(id);
      queue.push(...connections.get(id));
    }
  }
  return connectedPrograms;
};

export const part1 = connections => getGroupIds(connections, 0).size;

export const part2 = input => {
  let remainingIds = Array.from(input.keys());
  let groups = 0;

  do {
    const groupIds = getGroupIds(input, remainingIds.pop());
    // Keep only items which are not in the discovered group
    remainingIds = remainingIds.filter(id => !groupIds.has(id));
    groups += 1;
  } while (remainingIds.length);
  return groups;
};
