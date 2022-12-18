import BinaryHeap from '../../utils/binary-heap.js';

const valveRe = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/;

export const formatInput = input => {
  const entries = input.split('\n').map(row => {
    const [, valve, rate, tunnels] = row.match(valveRe);
    return [valve, { rate: +rate, tunnels: tunnels.split(', ') }];
  });
  return Object.fromEntries(entries);
};

const calcMaxPressure = (valves, scan, time = 30) => valves.reduce((sum, valve, i) => sum + scan[valve].rate * Math.max(0, time - (i + 1) * 2), 0);

export const part1 = input => {
  const blockedValves = Object.entries(input)
    .sort(([, { rate: rate1 }], [, { rate: rate2 }]) => rate2 - rate1)
    .filter(([, { rate }]) => rate)
    .map(([valve]) => valve);

  const queue = new BinaryHeap(state => -state.pressure);
  queue.push({ tunnel: 'AA', pressure: 0, time: 30, blocked: blockedValves });

  let maxPressure = -Infinity;
  // Go throw various path options
  do {
    const state = queue.pop();

    // If no time left of or valves are open already – get the result
    if (state.time === 0 || state.blocked.length === 0) {
      maxPressure = Math.max(maxPressure, state.pressure);
      continue;
    }

    input[state.tunnel].tunnels.forEach(tunnel => {
      let projectedPressure = state.pressure + calcMaxPressure(state.blocked, input, state.time - 1);
      if (projectedPressure > maxPressure) {
        queue.push({
          tunnel,
          blocked: state.blocked,
          pressure: state.pressure,
          time: state.time - 1,
        });
      }

      const { rate } = input[tunnel];
      if (rate > 0 && state.blocked.includes(tunnel)) {
        const time = state.time - 2;
        const pressure = state.pressure + rate * time;
        const blocked = state.blocked.filter(valve => valve !== tunnel);
        projectedPressure = pressure + calcMaxPressure(blocked, input, time);
        if (projectedPressure > maxPressure) {
          queue.push({ tunnel, blocked, pressure, time });
        }
      }
    });
  } while (queue.size);
  return maxPressure;
};

export const part2 = input => {
  const result = part1(input);
  console.log(result);
  return null;
};
