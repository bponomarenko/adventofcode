const stepFn = (machine, value, move, nextState) => {
  // write
  machine.tape[machine.pos] = value;

  // move
  if (move > 0) {
    machine.pos += 1;
  } else if (machine.pos === 0) {
    machine.tape.unshift(0);
  } else {
    machine.pos -= 1;
  }

  // continue
  machine.state = nextState;
};

export const formatInput = input => {
  const [prefix, ...states] = input.split('\n\n');
  const [, state, steps] = prefix.match(/Begin in state (\w)\.\sPerform a diagnostic checksum after (\d+) steps/);

  const stateEntries = states.map(lines => {
    const [name, ...fns] = lines.split('\n');
    const zeroValue = fns[1].endsWith('1.') ? 1 : 0;
    const zeroMove = fns[2].endsWith('right.') ? 1 : -1;
    const zeroNextStep = fns[3].slice(-2, -1);
    const oneValue = fns[5].endsWith('1.') ? 1 : 0;
    const oneMove = fns[6].endsWith('right.') ? 1 : -1;
    const oneNextStep = fns[7].slice(-2, -1);

    return [name.slice(-2, -1), machine => {
      if (machine.tape[machine.pos] === 1) {
        stepFn(machine, oneValue, oneMove, oneNextStep);
      } else {
        stepFn(machine, zeroValue, zeroMove, zeroNextStep);
      }
    }];
  });
  return {
    pos: 0,
    tape: [0],
    steps: +steps,
    state,
    states: Object.fromEntries(stateEntries),
  };
};

export const part1 = input => {
  for (let i = 0; i < input.steps; i += 1) {
    input.states[input.state](input);
  }
  return input.tape.filter(Boolean).length;
};

// Traditionally, there is no part2 on the 25th day. Yay
export const part2 = () => null;
