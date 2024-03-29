export const formatInput = input => input.split('\n');

const lettersRe = /\D/g;
const getTwoDigitNum = str => {
  const digitsStr = str.replace(lettersRe, '');
  return +`${digitsStr.at(0)}${digitsStr.at(-1)}`;
};

export const part1 = input => input.sum(getTwoDigitNum);

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  .map((digit, index) => [digit, `${digit.at(0)}${index + 1}${digit.at(-1)}`]);

export const part2 = input => input.sum(line => {
  digits.forEach(([digit, replace]) => {
    line = line.replaceAll(digit, replace);
  });
  return getTwoDigitNum(line);
});
