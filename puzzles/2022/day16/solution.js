import BinaryHeap from '../../utils/binary-heap.js';

const valveRe = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/;

export const formatInput = input => {
  const entries = input.split('\n').map(row => {
    const [, valve, rate, tunnels] = row.match(valveRe);
    return [valve, { rate: +rate, tunnels: tunnels.split(', ') }];
  });
  return Object.fromEntries(entries);
};

const getBlockedValves = scan => Object.entries(scan)
  .filter(([, { rate }]) => rate)
  .sort(([, { rate: rate1 }], [, { rate: rate2 }]) => rate2 - rate1)
  .map(([valve]) => valve);

const calcMaxPressure = (valves, scan, time) => valves.sum((valve, i) => scan[valve].rate * Math.max(0, time - (i + 1) * 2));

export const part1 = scan => {
  const queue = new BinaryHeap(state => -state.pressure);
  queue.push({ tunnel: 'AA', pressure: 0, time: 30, blocked: getBlockedValves(scan) });

  let maxPressure = 0;
  // Go throw various path options
  do {
    const state = queue.pop();

    // If no time left of or valves are open already – get the result
    if (state.time === 0 || state.blocked.length === 0) {
      maxPressure = Math.max(maxPressure, state.pressure);
      continue;
    }

    scan[state.tunnel].tunnels.forEach(tunnel => {
      if (state.pressure + calcMaxPressure(state.blocked, scan, state.time - 1) > maxPressure) {
        queue.push({
          tunnel,
          blocked: state.blocked,
          pressure: state.pressure,
          time: state.time - 1,
        });
      }

      const { rate } = scan[tunnel];
      if (rate > 0 && state.blocked.includes(tunnel) && state.time - 2 >= 0) {
        const time = state.time - 2;
        const pressure = state.pressure + rate * time;
        const blocked = state.blocked.filter(valve => valve !== tunnel);
        if (pressure + calcMaxPressure(blocked, scan, time) > maxPressure) {
          queue.push({ tunnel, blocked, pressure, time });
        }
      }
    });
  } while (queue.size);
  return maxPressure;
};

function* combinations(scan, tunnel1, tunnel2, sameTime) {
  const symmetrical = tunnel1 === tunnel2 && sameTime;
  const opts1 = scan[tunnel1].tunnels;
  const opts2 = scan[tunnel2].tunnels;

  for (let i = 0; i < opts1.length; i += 1) {
    for (let j = symmetrical ? i : 0; j < opts2.length; j += 1) {
      yield [opts1[i], false, opts2[j], false];
      yield [opts1[i], true, opts2[j], false];
      if (!symmetrical) {
        yield [opts1[i], false, opts2[j], true];
      }
      if (opts1[i] !== opts2[j]) {
        yield [opts1[i], true, opts2[j], true];
      }
    }
  }
}

const calcMaxPressure2 = (valves, scan, time1, time2) => {
  const valvesCount = valves.length;
  let sum = 0;
  let i = 0;
  let count = 1;
  let canContinue;

  do {
    canContinue = false;
    if ((time1 - count * 2) >= 0 && i < valvesCount) {
      sum += (time1 - count * 2) * scan[valves[i]].rate;
      i += 1;
      canContinue = true;
    }
    if ((time2 - count * 2) >= 0 && i < valvesCount) {
      sum += (time2 - count * 2) * scan[valves[i]].rate;
      i += 1;
      canContinue = true;
    }
    count += 1;
  } while (canContinue);
  return sum;
};

const getHash = (time1, time2, tunnel1, tunnel2, blocked) => `${time1}|${time2}|${tunnel1}|${tunnel2}|${blocked.join(',')}`;

export const part2 = scan => {
  const queue = new BinaryHeap(state => -state.pressure);
  queue.push({
    tunnel1: 'AA',
    tunnel2: 'AA',
    time1: 26,
    time2: 26,
    pressure: 0,
    blocked: getBlockedValves(scan),
  });
  const visited = new Map();

  let maxPressure = 0;
  // Go throw various path options
  do {
    const state = queue.pop();

    const hash = getHash(state.time1, state.time2, state.tunnel1, state.tunnel2, state.blocked);
    if (visited.has(hash) && visited.get(hash) >= state.pressure) {
      continue;
    }
    visited.set(hash, state.pressure);
    visited.set(getHash(state.time2, state.time1, state.tunnel2, state.tunnel1, state.blocked), state.pressure);

    // If no time left of or valves are open already – get the result
    if (state.time1 === 0 || state.time2 === 0 || state.blocked.length === 0) {
      maxPressure = Math.max(maxPressure, state.pressure);
      continue;
    }

    for (const [tunnel1, open1, tunnel2, open2] of combinations(scan, state.tunnel1, state.tunnel2, state.time1 === state.time2)) {
      const rate1 = scan[tunnel1].rate;
      const rate2 = scan[tunnel2].rate;
      // Skip the combo if cannot open the valve
      if (open1 && (rate1 === 0 || state.time1 - 2 < 0 || !state.blocked.includes(tunnel1))) {
        continue;
      }
      if (open2 && (rate2 === 0 || state.time2 - 2 < 0 || !state.blocked.includes(tunnel2))) {
        continue;
      }

      const time1 = state.time1 - (open1 ? 2 : 1);
      const time2 = state.time2 - (open2 ? 2 : 1);
      const pressure = state.pressure + (open1 ? time1 * rate1 : 0) + (open2 ? time2 * rate2 : 0);
      const blocked = open1 || open2 ? state.blocked.filter(valve => (!open1 || valve !== tunnel1) && (!open2 || valve !== tunnel2)) : state.blocked;

      if (pressure + calcMaxPressure2(blocked, scan, time1, time2) > maxPressure) {
        queue.push({
          tunnel1, tunnel2, time1, time2, pressure, blocked,
        });
      }
    }
  } while (queue.size);
  return maxPressure;
};
