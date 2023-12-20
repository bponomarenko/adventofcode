export const formatInput = input => {
  const entries = input.split('\n').map(row => {
    const [prefix, dest] = row.split(' -> ');
    return [
      prefix === 'broadcaster' ? prefix : prefix.slice(1),
      { type: prefix.slice(0, 1), dest: dest.split(', ') },
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
    if (onSignal(signal, from, counter)) {
      counterLimit = 0;
    }
    queue.push([name, signal, from]);
  });

  while (counter < counterLimit) {
    sendSignals(['broadcaster'], false, 'button');

    while (queue.length) {
      const [name, signal, from] = queue.shift();
      const mod = machine[name];
      switch (mod?.type) {
        case 'b':
          sendSignals(mod.dest, false, name);
          break;
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
  // Find all modules that sends signal to the rx module
  const modules = Object.entries(input);
  const rxSource = modules.find(([, { dest }]) => dest.includes('rx'));
  // should be only one module of the "conjunction" type
  if (!rxSource || rxSource[1].type !== '&') {
    throw new Error('Not expected input');
  }
  const conjSources = modules.filter(([, { dest }]) => dest.includes(rxSource[0])).map(([name]) => name);
  const loopCycles = new Array(conjSources.length).fill(0);

  runMachine(input, Infinity, (signal, from, counter) => {
    if (signal && conjSources.includes(from)) {
      // Found the loop for one of the sources
      loopCycles[conjSources.indexOf(from)] = counter + 1;
      if (loopCycles.every(value => value > 0)) {
        return true;
      }
    }
    return false;
  });
  return loopCycles.lcm();
};
