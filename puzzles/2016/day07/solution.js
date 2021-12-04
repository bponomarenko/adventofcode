export const formatInput = input => input.split('\n');

const abbaRe = /(\w)(?!\1)(\w)\2\1/;

export const part1 = input => input
  .filter(line => {
    const [valid, invalid] = line
      .split(/[[\]]/)
      .reduce((acc, part, i) => {
        acc[i % 2].push(part);
        return acc;
      }, [[], []]);
    return valid.some(part => abbaRe.test(part)) && invalid.every(part => !abbaRe.test(part));
  })
  .length;

const abaRe = /(\w)(?!\1)(\w)\1\w*(?:\[\w+\]\w*)*\[\w*\2\1\2|(\w)(?!\3)(\w)\3\w*\]\w*(?:\[\w+\]\w*)*\4\3\4/;

export const part2 = input => input.filter(line => abaRe.test(line)).length;
