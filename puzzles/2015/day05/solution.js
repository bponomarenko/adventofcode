export const formatInput = input => input.split('\n');

const vowelsRegex = /[aeiou].*[aeiou].*[aeiou]/;
const pairRegex = /(\w)\1(?!\1)/;
const consequentRegex = /ab|cd|pq|xy/;

export const part1 = input => input.filter(str => {
  if (!str) {
    return false;
  }
  return vowelsRegex.test(str) && pairRegex.test(str) && !consequentRegex.test(str);
})
  .length;

const pairsRegex = /(\w{2}).*\1/;
const repeatRegex = /(\w)[^\1]\1/;

export const part2 = input => input.filter(str => {
  if (!str) {
    return false;
  }
  return pairsRegex.test(str) && repeatRegex.test(str);
})
  .length;
