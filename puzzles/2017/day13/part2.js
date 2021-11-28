const { formatInput, updateScanners } = require('./part1');

const main = ({ firewall, layers }) => {
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

module.exports = { main: input => main(formatInput(input)) };
