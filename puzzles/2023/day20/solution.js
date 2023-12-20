export const formatInput = input => {
  const entries = input.split('\n').map(row => {
    const [prefix, dest] = row.split(' -> ');
    return [
      prefix === 'broadcaster' ? prefix : prefix.slice(1),
      {
        type: prefix === 'broadcaster' ? null : prefix.slice(0, 1),
        dest: dest.split(', '),
      },
    ];
  });

  const modules = Object.fromEntries(entries);
  entries.forEach(([name, { type }]) => {
    if (type === '&') {
      // find all the inputs
      const inputEntries = entries
        .filter(([, { dest }]) => dest.includes(name))
        .map(([from]) => [from, false]);
      modules[name].pulses = Object.fromEntries(inputEntries);
    }
  });
  return modules;
};

const runMachine = (machine, counterLimit, onSignal) => {
  const queue = [];
  let counter = 0;

  const sendSignals = (dest, signal, from) => dest.forEach(name => {
    onSignal(signal);
    queue.push([name, signal, from]);
  });

  while (counter < counterLimit) {
    onSignal(false);
    sendSignals(machine.broadcaster.dest, false, 'broadcaster');

    while (queue.length) {
      const [name, signal, from] = queue.shift();
      const mod = machine[name];
      switch (mod?.type) {
        case '%':
          if (!signal) {
            mod.on = !mod.on;
            sendSignals(mod.dest, mod.on, name);
          }
          break;
        case '&':
          mod.pulses[from] = signal;
          sendSignals(mod.dest, Object.values(mod.pulses).some(pulse => !pulse), name);
          break;
        case 'finish':
          if (!signal) {
            return counter;
          }
      }
    }
    counter += 1;
  }
  return counter;
};

export const part1 = input => {
  let lowCounter = 0;
  let highCounter = 0;
  runMachine(input, 1000, signal => {
    if (signal) {
      highCounter += 1;
    } else {
      lowCounter += 1;
    }
  });
  return highCounter * lowCounter;
};

export const part2 = input => {
  input.rx = { type: 'finish' };
  return runMachine(input, Infinity, () => {});
};
