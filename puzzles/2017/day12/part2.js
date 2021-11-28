const { formatInput, getGroupIds } = require('./part1');

const main = connections => {
  let remainingIds = Array.from(connections.keys());
  let groups = 0;

  do {
    const groupIds = getGroupIds(connections, remainingIds.pop());
    // Keep only items which are not in the discovered group
    remainingIds = remainingIds.filter(id => !groupIds.has(id));
    groups += 1;
  } while (remainingIds.length);
  return groups;
};

module.exports = { main: input => main(formatInput(input)) };
