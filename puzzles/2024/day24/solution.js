export const formatInput = input => {
  const [wires, gates] = input.split('\n\n');
  const output = [];
  return [
    new Map(wires.split('\n').map(wire => {
      const [name, signal] = wire.split(': ');
      return [name, +signal];
    })),
    new Map(gates.split('\n').map(gate => {
      const [params, out] = gate.split(' -> ');
      if (out.startsWith('z')) {
        output.push(out);
      }
      return [out, params.split(' ')];
    })),
    output.toSorted().reverse(),
  ];
};

const combine = (reg, wires, gates) => {
  const [r1, op, r2] = gates.get(reg);
  switch (op) {
    case 'AND':
      return getSignal(r1, wires, gates) & getSignal(r2, wires, gates);
    case 'OR':
      return getSignal(r1, wires, gates) | getSignal(r2, wires, gates);
    case 'XOR':
      return getSignal(r1, wires, gates) ^ getSignal(r2, wires, gates);
  }
  return 0;
};

const getSignal = (reg, wires, gates) => {
  if (!wires.has(reg)) {
    const signal = combine(reg, wires, gates);
    wires.set(reg, signal);
  }
  return wires.get(reg);
};

export const part1 = ([wires, gates, out]) => parseInt(out.map(reg => getSignal(reg, wires, gates)).join(''), 2);

export const part2 = input => {
  console.log(input);
  return null;
};
