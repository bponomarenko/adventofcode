export const formatInput = input => input.split('\n\n').map((line, index) => {
  const [value1, value2] = line.split('\n');
  // eslint-disable-next-line no-eval
  return { value1: eval(value1), value2: eval(value2), index, line1: value1, line2: value2 };
});

function compareArrays(v1, v2) {
  const l1 = v1.length;
  const l2 = v2.length;

  for (let i = 0, m = Math.min(l1, l2); i < m; i += 1) {
    // eslint-disable-next-line no-use-before-define
    const result = compareValues(v1[i], v2[i]);
    if (result !== 0) {
      return result;
    }
  }
  return l1 === l2 ? 0 : l1 < l2;
}

function compareValues(v1, v2) {
  const isArr1 = Array.isArray(v1);
  const isArr2 = Array.isArray(v2);

  // Both are lists
  if (isArr1 && isArr2) {
    return compareArrays(v1, v2);
  }

  // Both are integers
  if (!isArr1 && !isArr2) {
    return v1 === v2 ? 0 : v1 < v2;
  }
  // Mixed data
  return compareArrays(isArr1 ? v1 : [v1], isArr2 ? v2 : [v2]);
}

export const part1 = input => input
  .filter(({ value1, value2 }) => compareValues(value1, value2) !== false)
  .reduce((acc, { index }) => acc + index + 1, 0);

export const part2 = input => {
  const div1 = '[[2]]';
  const div2 = '[[6]]';
  // eslint-disable-next-line no-eval
  const list = [{ value1: eval(div1), value2: eval(div2), line1: div1, line2: div2 }]
    .concat(input)
    .flatMap(row => [{ value: row.value1, line: row.line1 }, { value: row.value2, line: row.line2 }])
    .sort((v1, v2) => {
      const result = compareValues(v2.value, v1.value);
      if (result === 0) {
        return result;
      }
      return result ? 1 : -1;
    })
    .map(({ line }) => line);

  return (list.indexOf(div1) + 1) * (list.indexOf(div2) + 1);
};
