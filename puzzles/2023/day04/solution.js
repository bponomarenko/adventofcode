export const formatInput = input => input.split('\n').map(line => {
  const cardNums = line.split(': ')[1];
  const [winning, nums] = cardNums.split(' | ').map(group => group.split(' ').filter(Boolean).map(Number));
  const win = nums.filter(num => winning.includes(num));
  return win.length > 0 ? [2 ** (win.length - 1), win.length, 1] : [0, 0, 1];
});

export const part1 = input => input.sum(([score]) => score);

export const part2 = input => {
  input.forEach(([, count, pile], index) => {
    if (count > 0) {
      for (let i = index + 1; i <= index + count; i += 1) {
        input[i][2] += pile;
      }
    }
  });
  return input.sum(([, , pile]) => pile);
};
