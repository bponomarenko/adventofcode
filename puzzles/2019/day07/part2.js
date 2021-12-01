const { formatInput } = require('./part1');
const Intcode = require('../day05/intcode');

function* combinations(values = [5, 6, 7, 8, 9]) {
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

const generateAmplifiers = (program, combo) => new Array(5)
  .fill()
  .map((_, index) => new Intcode(program, true, combo[index]));

const runLoop = (amplifiers, firstInput) => amplifiers.reduce((input, amplifier) => {
  amplifier.run(input);
  return amplifier.lastOutput;
}, firstInput);

const main = input => {
  let maxSignal = 0;
  for (const combo of combinations()) {
    let loopInput = 0;
    const amplifiers = generateAmplifiers(input, combo);
    do {
      loopInput = runLoop(amplifiers, loopInput);
    } while (amplifiers.at(-1).paused);
    maxSignal = Math.max(maxSignal, loopInput);
  }
  return maxSignal;
};

module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
