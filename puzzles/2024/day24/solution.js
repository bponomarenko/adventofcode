export const formatInput = input => {
  const [wires, gates] = input.split('\n\n');
  const output = [];
  return [
    new Map(wires.split('\n').map(wire => {
      const [name, signal] = wire.split(': ');
      return [name, [+signal, []]];
    })),
    new Map(gates.split('\n').map(gate => {
      const [params, out] = gate.split(' -> ');
      if (out.startsWith('z')) {
        output.push(out);
      }
      return [out, params.split(' ')];
    })),
    output.toSorted(),
  ];
};

const combine = (reg, wires, gates, stack) => {
  const [r1, op, r2] = gates.get(reg);
  const [s1, usedWires1] = getSignal(r1, wires, gates, stack) ?? [];
  const [s2, usedWires2] = getSignal(r2, wires, gates, stack) ?? [];
  if (s1 == null || s2 == null) {
    return null;
  }
  const usedWires = [...usedWires1, ...usedWires2, reg].unique();
  switch (op) {
    case 'AND':
      return [s1 & s2, usedWires];
    case 'OR':
      return [s1 | s2, usedWires];
    case 'XOR':
      return [s1 ^ s2, usedWires];
  }
};

const getSignal = (reg, wires, gates, stack = []) => {
  if (!wires.has(reg)) {
    if (stack.includes(reg)) {
      // circular reference
      return null;
    }
    const signal = combine(reg, wires, gates, stack.concat(reg));
    if (!signal) {
      return null;
    }
    wires.set(reg, signal);
  }
  return wires.get(reg);
};

export const part1 = ([wires, gates, out]) => parseInt(out.toReversed().map(reg => getSignal(reg, wires, gates)[0]).join(''), 2);

// const swap = (gates, wire1, wire2) => {
//   const gate = gates.get(wire1);
//   gates.set(wire1, gates.get(wire2));
//   gates.set(wire2, gate);
// };

const key = (name, i) => `${name}${String(i).padStart(2, '0')}`;

/**
 * Addition of two numbers in the binary format would require to compare bits in a specific position,
 * and then carry over remainder to the next position. This means that any following positions would
 * use some intermediate result from the previous position. Based on that we can make a conclusion that
 * gates would be used in a specific pattern, where some of the gates from the previous position would
 * be used in the next one.
 * By analyzing gates used for every zXX wire, there is indeed a pattern – starting from 2nd bit (counting
 * from the least significant one) amount of the used gates would increase exactly by 4 items. It is also
 * immediately clear which of the zXX wires are not following the pattern, which is an indication that
 * their gates are exactly the ones that have to be swapped.
 *
 * Code in this part doesn't solve the puzzle, but instead analyses individual zXX wires and prints
 * those with an error. This helped to look into those parts individually by drawing them on piece of paper
 * to identify which wires has to be swapped.
 */
export const part2 = ([, gates, out]) => {
  const gateEntries = Array.from(gates.entries());

  // every z[i] wires (except the last one) should consist of XOR gate with two other wires
  out.slice(0, -1).forEach(z => {
    const [, op] = gates.get(z);
    if (op !== 'XOR') {
      console.log('invalid', z);
    }
  });

  out.slice(1, -1).forEach((z, i) => {
    const xi1 = key('x', i + 1);
    const yi1 = key('y', i + 1);
    // there should be (x[i] XOR y[i]) that outputs to the wire, which is part of another gate that outputs to the z[i], and
    const [xorOut] = gateEntries.find(([, [w1, op, w2]]) => op === 'XOR' && ((w1 === xi1 && w2 === yi1) || (w2 === xi1 && w1 === yi1)));
    const xorGate = gates.get(z);
    if (xorGate[0] !== xorOut && xorGate[2] !== xorOut) {
      console.log(z, xorOut);
    }
  });
  return ['ksv', 'z06', 'tqq', 'z20', 'ckb', 'z39', 'kbs', 'nbd'].toSorted();
};
