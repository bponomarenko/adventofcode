export const formatInput = input => input.split('\n').map(line => {
  const [test, nums] = line.split(':');
  return [+test, nums.trim().split(' ').map(Number).toReversed()];
});

function* equationResults(test, withConcatenation, n1, ...nums) {
  if (nums.length) {
    for (const n2 of equationResults(test, withConcatenation, ...nums)) {
      let res = n1 + n2;
      if (res <= test) {
        yield res;
      }
      res = n1 * n2;
      if (res <= test) {
        yield res;
      }
      if (withConcatenation) {
        res = +`${n2}${n1}`;
        if (res <= test) {
          yield res;
        }
      }
    }
  } else {
    yield n1;
  }
}

const getCalibrationResult = (input, withConcatenation = false) => input
  .sum(([test, nums]) => {
    for (let res of equationResults(test, withConcatenation, ...nums)) {
      if (res === test) {
        return test;
      }
    }
    return 0;
  });

export const part1 = input => getCalibrationResult(input);

export const part2 = input => getCalibrationResult(input, true);
