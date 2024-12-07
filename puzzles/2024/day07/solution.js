export const formatInput = input => input.split('\n').map(line => {
  const [test, nums] = line.split(':');
  return [+test, nums.trim().split(' ').map(Number).toReversed()];
});

function* equationResults(withConcatenation, n1, ...nums) {
  if (nums.length) {
    for (const n2 of equationResults(withConcatenation, ...nums)) {
      yield n1 + n2;
      yield n1 * n2;
      if (withConcatenation) {
        yield +`${n2}${n1}`;
      }
    }
  } else {
    yield n1;
  }
}

const getCalibrationResult = (input, withConcatenation = false) => input
  .sum(([test, nums]) => {
    for (let res of equationResults(withConcatenation, ...nums)) {
      if (res === test) {
        return test;
      }
    }
    return 0;
  });

export const part1 = input => getCalibrationResult(input);

export const part2 = input => getCalibrationResult(input, true);
