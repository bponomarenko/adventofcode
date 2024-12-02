export const formatInput = input => input.split('\n').map(line => line.split(' ').map(Number));

const isSafe = report => {
  const sorted = report.toSorted((a, b) => a - b).join('-');
  if (sorted !== report.join('-') && sorted !== report.toReversed().join('-')) {
    return false;
  }

  for (let [n1, n2] of report.slidingWindows(2)) {
    const diff = Math.abs(n1 - n2);
    if (diff <= 0 || diff > 3) {
      return false;
    }
  }
  return true;
};

const countSafeReports = (reports, filterFn = isSafe) => reports.filter(filterFn).length;

export const part1 = input => countSafeReports(input);

export const part2 = input => countSafeReports(input, report => {
  if (isSafe(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i += 1) {
    if (isSafe(report.toSpliced(i, 1))) {
      return true;
    }
  }
  return false;
});
