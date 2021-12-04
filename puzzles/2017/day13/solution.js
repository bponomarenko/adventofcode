export const formatInput = input => {
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

export const part1 = ({ firewall, layers }) => {
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

export const part2 = ({ firewall, layers }) => {
  const indexes = layers.map(([depth]) => depth);
  const distanceLength = firewall.length;
  let packets = [];
  let t = 0;
  let winner;

  do {
    // 1. Add new potential packet
    packets.push({ pos: 0, delay: t });

    // 2. Check if any of the packets busted. If not, move them to the next position
    packets.forEach(packet => {
      if (firewall[packet.pos]?.pos === 0) {
        // Caught! Increase severity
        packet.busted = true;
      } else {
        packet.pos += 1;
      }
    });

    // 3. Keep only "alive" packets
    packets = packets.filter(({ busted }) => !busted);

    // 4. Find a winner
    winner = packets.find(({ pos }) => pos >= distanceLength);

    // 5. Update scanners position if no winner yet
    if (!winner) {
      updateScanners(indexes, firewall);
    }

    // 6. Increase time counter
    t += 1;
  } while (!winner);
  return winner.delay;
};
