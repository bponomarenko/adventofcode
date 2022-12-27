import Intcode from '../intcode.js';

export const formatInput = input => input;

export const part1 = input => {
  const comps = new Array(50).fill(null).map((_, i) => new Intcode(input, {
    autoRun: false,
    runTick: true,
    input: [i],
    inputFallback: () => -1,
  }));

  for (; ;) {
    for (const comp of comps) {
      comp.run();

      if (comp.output.length === 3) {
        const [addr, x, y] = comp.output;
        if (addr === 255) {
          return y;
        }

        comps[addr].input.push(x, y);
        comp.output.length = 0;
      }
    }
  }
};

export const part2 = async input => {
  const comps = new Array(50).fill(null).map((_, i) => {
    const comp = {
      intcode: new Intcode(input, {
        autoRun: false,
        runTick: true,
        input: [i],
        inputFallback: () => {
          comp.idle = true;
          return -1;
        },
        convertOutput: value => {
          comp.idle = false;
          return value;
        },
      }),
      idle: false,
    };
    return comp;
  });

  let nat;
  let recovery;
  for (; ;) {
    let idle = true;

    for (const comp of comps) {
      comp.intcode.run();

      idle = idle && comp.idle;

      if (comp.intcode.output.length === 3) {
        const [addr, x, y] = comp.intcode.output;
        if (addr === 255) {
          nat = [x, y];
        } else {
          comps[addr].intcode.input.push(x, y);
        }
        comp.intcode.output.length = 0;
      }
    }

    if (idle && nat) {
      if (recovery === nat[1]) {
        return recovery;
      }
      [, recovery] = nat;
      comps[0].intcode.input.push(...nat);
      nat = null;
    }
  }
};
