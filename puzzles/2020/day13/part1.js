const formatInput = input => {
  const [timestamp, ids] = input.split('\n');
  return { timestamp: +timestamp, ids: ids.split(',') };
};

const main = input => {
  const firstBus = input.ids
    .map(id => (id === 'x' ? null : [+id, id - (input.timestamp % id)]))
    .filter(Boolean)
    .sort(([, d1], [, d2]) => d1 - d2)[0];
  return firstBus[0] * firstBus[1];
};

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
};
