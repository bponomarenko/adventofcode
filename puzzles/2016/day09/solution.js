export const formatInput = input => input;

const markerRe = /\((\d+)x(\d+)\)/;

export const part1 = input => {
  let str = input;
  let length = 0;
  let match;

  // eslint-disable-next-line no-cond-assign
  while (match = markerRe.exec(str)) {
    str = str.slice(match.index + match[0].length + +match[1]);
    length += match.index + (+match[1] * +match[2]);
  }
  return length + str.length;
};

const findLength = str => {
  let length = 0;
  let match;
  // eslint-disable-next-line no-cond-assign
  while (match = markerRe.exec(str)) {
    const shift = match.index + match[0].length;
    length += match.index + findLength(str.slice(shift, shift + +match[1])) * match[2];
    str = str.slice(shift + +match[1]);
  }
  return length + str.length;
};
export const part2 = input => findLength(input);
