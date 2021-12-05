let cache = {};

const signal = (wires, wire) => {
  if (wire in cache) {
    return cache[wire];
  }

  if (Number.isNaN(+wire)) {
    const val = wires[wire](wires);
    cache[wire] = val;
    return val;
  }
  return +wire;
};

const gate = operation => {
  if (operation.includes('NOT')) {
    return wires => 2 ** 16 - 1 - signal(wires, operation.split(' ')[1]);
  }
  if (operation.includes('AND')) {
    const [w1, w2] = operation.split(' AND ');
    return wires => signal(wires, w1) & signal(wires, w2);
  }
  if (operation.includes('OR')) {
    const [w1, w2] = operation.split(' OR ');
    return wires => signal(wires, w1) | signal(wires, w2);
  }
  if (operation.includes('LSHIFT')) {
    const [w1, size] = operation.split(' LSHIFT ');
    return wires => signal(wires, w1) << +size;
  }
  if (operation.includes('RSHIFT')) {
    const [w1, size] = operation.split(' RSHIFT ');
    return wires => signal(wires, w1) >> +size;
  }
  return wires => signal(wires, operation);
};

export const formatInput = input => {
  const entries = input.split('\n').map(instr => {
    const [operation, wire] = instr.split(' -> ');
    return [wire, gate(operation)];
  });
  return Object.fromEntries(entries);
};

export const part1 = wires => wires.a(wires);

export const part2 = wires => {
  const aValue = wires.a(wires);
  wires.b = () => aValue;
  cache = {};

  return wires.a(wires);
};
