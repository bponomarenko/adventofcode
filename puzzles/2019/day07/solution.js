import { permutations } from '../../utils/collections.js';
import Intcode from '../intcode.js';

export const formatInput = input => input.split(',').map(Number);

const runSetting = (sequence, phaseSetting) => phaseSetting
  .reduce((acc, setting) => new Intcode(sequence, { input: [setting, acc] }).lastOutput, 0);

export const part1 = input => {
  let maxSignal = 0;
  for (const combo of permutations([0, 1, 2, 3, 4], 5)) {
    maxSignal = Math.max(runSetting(input, combo), maxSignal);
  }
  return maxSignal;
};

const generateAmplifiers = (program, combo) => new Array(5).fill()
  .map((_, index) => new Intcode(program, { pauseOnOutput: true, input: [combo[index]], autoRun: false }));

const runLoop = (amplifiers, firstInput) => amplifiers.reduce((input, amplifier) => amplifier.run(input).lastOutput, firstInput);

export const part2 = input => {
  let maxSignal = 0;
  for (const combo of permutations([5, 6, 7, 8, 9], 5)) {
    let loopInput = 0;
    const amplifiers = generateAmplifiers(input, combo);
    do {
      loopInput = runLoop(amplifiers, loopInput);
    } while (amplifiers.at(-1).paused);
    maxSignal = Math.max(maxSignal, loopInput);
  }
  return maxSignal;
};
