const formatInput = input => {
  const firewall = [];
  const layers = input.split('\n').map(layer => layer.split(': ').map(num => +num));
  layers.forEach(([depth, range]) => {
    firewall[depth] = { pos: 0, range, dir: 'down' };
  });
  return { firewall, layers };
};

const updateScanners = (indexes, firewall) => {
  indexes.forEach(index => {
    const layer = firewall[index];
    let { pos, dir } = layer;
    if (dir === 'down') {
      if (pos === layer.range - 1) {
        pos -= 1;
        dir = 'up';
      } else {
        pos += 1;
      }
    } else if (pos === 0) {
      pos += 1;
      dir = 'down';
    } else {
      pos -= 1;
    }
    firewall[index].pos = pos;
    firewall[index].dir = dir;
  });
};

const main = ({ firewall, layers }) => {
  const indexes = layers.map(([depth]) => depth);

  let severity = 0;
  for (let t = 0; t < firewall.length; t += 1) {
    // 1. Check layer
    if (firewall[t]?.pos === 0) {
      // Caught! Increase severity
      severity += firewall[t].range * t;
    }

    // 2. Update scanners position
    updateScanners(indexes, firewall);
  }
  return severity;
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  updateScanners,
};
