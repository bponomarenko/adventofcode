const re = /^(?<n1>\w+)(.+\sgain\s(?<plus>\d+).+| .+\slose\s(?<minus>\d+).+)\s(?<n2>\w+).$/;

export const formatInput = input => input.split('\n').map(str => {
  const { n1, n2, plus, minus } = re.exec(str).groups;
  return { n1, n2, change: plus ? +plus : -minus };
});

const getSeatingPlans = guests => {
  if (guests.length > 1) {
    return guests.flatMap((city, index) => {
      const guestsSlice = [...guests];
      guestsSlice.splice(index, 1);
      return getSeatingPlans(guestsSlice).map(plans => [city, ...plans]);
    });
  }
  return [guests];
};

const getHappinessChange = (map, guest, nextGuest, prevGuest) => {
  const nextGuestChange = map.find(({ n1, n2 }) => n1 === guest && n2 === nextGuest).change;
  const prevGuestChange = map.find(({ n1, n2 }) => n1 === guest && n2 === prevGuest).change;
  return nextGuestChange + prevGuestChange;
};

export const part1 = happinessMap => {
  const projectedHappinessLevels = getSeatingPlans(happinessMap.map(({ n1 }) => n1).unique())
    .map(plan => plan.reduce((acc, guest, index) => {
      const nextIndex = index + 1 === plan.length ? 0 : index + 1;
      const prevIndex = index - 1 < 0 ? plan.length - 1 : index - 1;
      return acc + getHappinessChange(happinessMap, guest, plan[nextIndex], plan[prevIndex]);
    }, 0));
  return Math.max(...projectedHappinessLevels);
};

export const part2 = happinessMap => {
  const guests = happinessMap.map(({ n1 }) => n1).unique();

  guests.forEach(guest => {
    happinessMap.push({ n1: 'myself', n2: guest, change: 0 }, { n1: guest, n2: 'myself', change: 0 });
  });
  guests.push('myself');

  return getSeatingPlans(guests)
    .reduce((max, plan) => {
      const happinessLevel = plan.reduce((acc, guest, index) => {
        const nextIndex = index + 1 === plan.length ? 0 : index + 1;
        const prevIndex = index - 1 < 0 ? plan.length - 1 : index - 1;
        return acc + getHappinessChange(happinessMap, guest, plan[nextIndex], plan[prevIndex]);
      }, 0);
      return Math.max(max, happinessLevel);
    }, 0);
};
