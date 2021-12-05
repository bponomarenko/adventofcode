import crypto from 'crypto';

export const formatInput = input => input;

const getHashSteps = (input, finish) => {
  let i = 0;
  let key;
  do {
    key = crypto.createHash('md5').update(`${input}${i}`).digest('hex');
    i += 1;
  } while (!key.startsWith(finish));
  return i - 1;
};

export const part1 = input => getHashSteps(input, '00000');

export const part2 = input => getHashSteps(input, '000000');
