export const formatInput = input => {
  const [rules, pages] = input.split('\n\n');
  return [
    rules.split('\n').map(line => line.split('|').map(Number)),
    pages.split('\n').map(line => line.split(',').map(Number)),
  ];
};

const isValid = (row, rules) => rules.every(([p1, p2]) => !row.includes(p1) || !row.includes(p2) || row.indexOf(p1) < row.indexOf(p2));

const getSortFn = (row, allRules) => {
  const rules = allRules.filter(([p1, p2]) => row.includes(p1) && row.includes(p2));
  return (n1, n2) => {
    const sortRule = rules.find(rule => rule.includes(n1) && rule.includes(n2));
    if (sortRule) {
      return sortRule[0] === n1 ? 1 : -1;
    }
    return 0;
  };
};

export const part1 = ([rules, pages]) => pages.filter(row => isValid(row, rules)).sum(row => row[(row.length - 1) / 2]);

export const part2 = ([rules, pages]) => pages.sum(row => (isValid(row, rules) ? 0 : row.toSorted(getSortFn(row, rules))[(row.length - 1) / 2]));
