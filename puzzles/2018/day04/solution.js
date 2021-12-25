const logRe = /-(?<date>\d{2}-\d{2}) (?<hour>\d{2}):(?<minute>\d{2})\] (Guard #(?<guard>\d+)|(?<up>wakes up)|falls asleep)/;

export const formatInput = input => input.split('\n').map(line => {
  const { date, hour, minute, guard, up } = line.match(logRe).groups;
  const log = { date, hour: +hour, minute: +minute };

  if (guard) {
    return { ...log, guard: +guard };
  }
  if (up) {
    return { ...log, up: true };
  }
  return { ...log, up: false };
});

export const part1 = input => {
  console.log(input);
  return null;
};

export const part2 = input => {
  console.log(part1(input));
  return null;
};
