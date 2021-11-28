const addValues = (map, key, value) => {
  if (!map.has(key)) {
    map.set(key, new Set([value]));
  } else {
    map.get(key).add(value);
  }
};

const formatInput = input => {
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

const main = connections => getGroupIds(connections, 0).size;

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  getGroupIds,
};
