import { sum } from '../../utils/collections.js';

export const formatInput = input => input.split('\n');

const lettersRe = /\D/g;

const getTwoDigitNum = str => {
  const digitsStr = str.replace(lettersRe, '');
  return +`${digitsStr.at(0)}${digitsStr.at(-1)}`;
};

export const part1 = input => sum(input.map(getTwoDigitNum));

const onlyLettersRe = /^\D*$/;
const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export const part2 = input => {
  const nums = input.map(line => {
    let digit = null;
    let index = Infinity;

    digits.forEach(num => {
      const firstIndex = line.indexOf(num);
      if (firstIndex !== -1 && firstIndex < index && onlyLettersRe.test(line.substring(0, firstIndex))) {
        index = firstIndex;
        digit = num;
      }
    });

    if (digit) {
      line = line.replace(digit, digits.indexOf(digit) + 1);
    }

    digit = null;
    index = -1;

    digits.forEach(num => {
      const lastIndex = line.lastIndexOf(num);
      if (lastIndex !== -1 && lastIndex > index && onlyLettersRe.test(line.substring(lastIndex))) {
        index = lastIndex;
        digit = num;
      }
    });

    if (digit) {
      const lastIndex = line.lastIndexOf(digit);
      line = `${line.substring(0, lastIndex)}${digits.indexOf(digit) + 1}${line.substring(lastIndex + digit.length)}`;
    }
    return getTwoDigitNum(line);
  });
  return sum(nums);
};
