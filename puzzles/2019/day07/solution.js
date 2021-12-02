const Intcode = require('../day05/intcode');

const formatInput = input => input.split(',').map(num => +num);

function* combinations(values = [0, 1, 2, 3, 4]) {
  for (let i = 0, l = values.length; i < l; i += 1) {
    const clone = [...values];
    clone.splice(i, 1);
    if (clone.length > 1) {
      for (const combo of combinations(clone)) {
        yield [values[i], ...combo];
      }
    } else {
      yield [values[i], clone[0]];
    }
  }
}

const runSetting = (sequence, phaseSetting) => phaseSetting
  .reduce((acc, setting) => new Intcode(sequence).run(setting, acc).pop(), 0);

const part1 = input => {
  let maxSignal = 0;
  for (const combo of combinations()) {
    maxSignal = Math.max(runSetting(input, combo), maxSignal);
  }
  return maxSignal;
};

function* combinations2(values = [5, 6, 7, 8, 9]) {
  for (let i = 0, l = values.length; i < l; i += 1) {
    const clone = [...values];
    clone.splice(i, 1);
    if (clone.length > 1) {
      for (const combo of combinations2(clone)) {
        yield [values[i], ...combo];
      }
    } else {
      yield [values[i], clone[0]];
    }
  }
}

const generateAmplifiers = (program, combo) => new Array(5)
  .fill()
  .map((_, index) => new Intcode(program, true, combo[index]));

const runLoop = (amplifiers, firstInput) => amplifiers.reduce((input, amplifier) => {
  amplifier.run(input);
  return amplifier.lastOutput;
}, firstInput);

const part2 = input => {
  let maxSignal = 0;
  for (const combo of combinations2()) {
    let loopInput = 0;
    const amplifiers = generateAmplifiers(input, combo);
    do {
      loopInput = runLoop(amplifiers, loopInput);
    } while (amplifiers.at(-1).paused);
    maxSignal = Math.max(maxSignal, loopInput);
  }
  return maxSignal;
};

module.exports = { part1, part2, formatInput };
