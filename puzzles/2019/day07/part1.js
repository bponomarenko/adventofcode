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

const main = input => {
  let maxSignal = 0;
  for (const combo of combinations()) {
    maxSignal = Math.max(runSetting(input, combo), maxSignal);
  }
  return maxSignal;
};

module.exports = {
  main: (input, isTest) => main(formatInput(input), isTest),
  formatInput,
};
