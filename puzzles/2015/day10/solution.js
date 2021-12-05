export const formatInput = input => input;

const getAddition = (count, char) => (count > 0 ? `${count}${char}` : '');

const process = (input, i, maxIteration) => {
  if (i >= maxIteration) {
    return input;
  }

  let result = '';
  let char = input[0];
  let counter = 0;

  for (let j = 0, l = input.length; j < l; j += 1) {
    if (input[j] === char) {
      counter += 1;
    } else {
      result += getAddition(counter, char);
      counter = 1;
      char = input[j];
    }
  }
  return process(result + getAddition(counter, char), i + 1, maxIteration);
};

export const part1 = input => process(input, 0, 40).length;

export const part2 = input => process(input, 0, 50).length;
