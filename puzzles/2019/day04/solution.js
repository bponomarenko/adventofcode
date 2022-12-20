export const formatInput = input => input.split('-').map(line => [...line].map(Number));

const getNextPass = pass => {
  const nextPass = [...pass];
  let i = nextPass.findLastIndex(n => n < 9);
  nextPass[i] += 1;
  i += 1;
  for (; i < 6; i += 1) {
    nextPass[i] = nextPass[i - 1];
  }
  return nextPass;
};

const advanceToNextValid = pass => {
  const nextPass = [...pass];
  for (let i = 1; i < 6; i += 1) {
    if (nextPass[i] < nextPass[i - 1]) {
      nextPass[i] = nextPass[i - 1];
    }
  }
  return nextPass;
};

const countValidPasswords = (start, max, check) => {
  const isValid = start.every((n, i) => i === 0 || n >= start[i - 1]);
  let pass = isValid ? getNextPass(start) : advanceToNextValid(start);
  let count = 0;

  if (+pass.join('') >= max) {
    return count;
  }

  do {
    if (check(pass)) {
      count += 1;
    }
    pass = getNextPass(pass);
  } while (+pass.join('') < max);
  return count;
};

export const part1 = input => countValidPasswords(input[0], +input[1].join(''), pass => new Set(pass).size < 6);

export const part2 = input => countValidPasswords(input[0], +input[1].join(''), pass => {
  let char = pass[0];
  let count = 1;
  for (let i = count; i < 6; i += 1) {
    if (pass[i] === char) {
      count += 1;
    } else if (count === 2) {
      break;
    } else {
      count = 1;
    }
    char = pass[i];
  }
  return count === 2;
});
