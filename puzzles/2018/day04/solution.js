const logRe = /-(?<month>\d{2})-(?<day>\d{2}) (?<hour>\d{2}):(?<minute>\d{2})\] (Guard #(?<guard>\d+)|(?<up>wakes up)|falls asleep)/;

const order = ['month', 'day', 'hour', 'minute'];

export const formatInput = input => input.split('\n')
  .map(line => {
    const {
      month, day, hour, minute, guard, up,
    } = line.match(logRe).groups;
    const log = { month: +month, day: +day, hour: +hour, minute: +minute };

    if (guard) {
      return { ...log, guard: +guard };
    }
    return { ...log, sleep: !up };
  })
  .sort((log1, log2) => {
    const prop = order.find(param => log1[param] !== log2[param]);
    return prop ? log1[prop] - log2[prop] : 0;
  });

const getSleepingHistory = input => {
  const sleepingIds = new Set();
  const { month, day, hour, minute } = input[0];
  const clock = { month, day, hour, minute };
  const history = new Map();
  let activeId;

  while (input.length) {
    if (clock.month === input[0].month && clock.day === input[0].day && clock.hour === input[0].hour && clock.minute === input[0].minute) {
      const item = input.shift();
      if (item.guard) {
        activeId = item.guard;
      } else if (item.sleep) {
        sleepingIds.add(activeId);
      } else {
        sleepingIds.delete(activeId);
      }
    }

    Array.from(sleepingIds).forEach(id => {
      if (!history.has(id)) {
        history.set(id, { total: 0, minutes: new Map() });
      }
      const guard = history.get(id);
      guard.total += 1;
      guard.minutes.set(clock.minute, (guard.minutes.get(clock.minute) || 0) + 1);
    });

    // advance clock
    clock.minute += 1;
    if (clock.minute === 60) {
      clock.minute = 0;
      clock.hour += 1;
      if (clock.hour === 24) {
        clock.hour = 0;
        clock.day += 1;
      }
      if (clock.day === 32) {
        clock.day = 1;
        clock.month += 1;
      }
    }
  }
  return history;
};

export const part1 = input => {
  const history = getSleepingHistory(input);
  const sleepingBeauty = Array.from(history.entries())
    .reduce((most, [id, { total }]) => (total > most.total ? { id, total } : most), { total: 0 })
    .id;
  const sleepingMinute = Array.from(history.get(sleepingBeauty).minutes.entries())
    .reduce((most, [min, count]) => (count > most.count ? { min, count } : most), { count: 0 })
    .min;
  return sleepingBeauty * sleepingMinute;
};

export const part2 = input => {
  const history = getSleepingHistory(input);
  const bestSleeper = Array.from(history.entries())
    .flatMap(([id, { minutes }]) => Array.from(minutes.entries()).map(([minute, count]) => ({ id, minute, count })))
    .reduce((most, guard) => (guard.count > most.count ? guard : most), { count: 0 });
  return bestSleeper.id * bestSleeper.minute;
};
