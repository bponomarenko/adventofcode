const diskRe = /^Disc #\d has (?<positions>\d+) positions; at time=0, it is at position (?<position>\d)\.$/;

export const formatInput = input => input.split('\n')
  .map((disk, i) => {
    const { position, positions } = diskRe.exec(disk).groups;
    return [+positions, +position];
  });

const isValid = (disks, step) => disks.every((disk, i) => (disk[1] + i + 1 + step) % disk[0] === 0);

export const part1 = input => {
  let step = 1;
  while (!isValid(input, step)) {
    step += 1;
  }
  return step;
};

export const part2 = input => {
  input.push([11, 0]);

  let step = 1;
  while (!isValid(input, step)) {
    step += 1;
  }
  return step;
};
