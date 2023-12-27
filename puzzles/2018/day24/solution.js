const groupRe = /^(\d+) units each with (\d+) hit points(?: \((.+)\))? with an attack that does (\d+) (\w+) damage at initiative (\d+)$/;

export const formatInput = input => input.split('\n\n').flatMap(army => army.split('\n').slice(1).map(group => {
  const [count, hp, qualities, damage, damageType, initiative] = group.match(groupRe).slice(1);
  const entries = qualities?.split('; ')
    .map(quality => (
      quality.startsWith('weak')
        ? ['weak', quality.replace('weak to ', '').split(', ')]
        : ['immune', quality.replace('immune to ', '').split(', ')]
    )) ?? [];
  return {
    type: army.slice(0, army.indexOf(':')),
    count: +count,
    hp: +hp,
    damage: +damage,
    damageType,
    initiative: +initiative,
    ...Object.fromEntries(entries),
  };
}));

const effectivePower = group => group.count * group.damage;
const calculateDamage = (attacker, target) => effectivePower(attacker) * (target.weak?.includes(attacker.damageType) ? 2 : 1);
const byInitiative = (g1, g2) => g2.initiative - g1.initiative;

const byPower = (g1, g2) => {
  const delta = effectivePower(g2) - effectivePower(g1);
  return delta === 0 ? byInitiative(g1, g2) : delta;
};

const combatArmies = groups => {
  while (groups.some(group => group.type !== groups[0].type)) {
    // choose targets
    groups.toSorted(byPower).forEach(group => {
      const target = groups
        .map(g => {
          if (g.chosen || g.type === group.type || g.immune?.includes(group.damageType)) {
            return null;
          }
          return [calculateDamage(group, g), g];
        })
        .filter(Boolean)
        .sort(([d1, g1], [d2, g2]) => {
          const delta = d2 - d1;
          return delta === 0 ? byPower(g1, g2) : delta;
        })[0]?.[1];

      if (target) {
        group.target = target;
        target.chosen = true;
      }
    });

    // special case when none of the groups selected another group – consider it a defeat to Infection
    if (groups.every(({ target }) => !target)) {
      return groups.filter(({ type }) => type === 'Infection');
    }

    // attack
    groups.toSorted(byInitiative).forEach(group => {
      const { count, target } = group;
      if (count <= 0 || !target) {
        return;
      }
      target.count -= Math.floor(calculateDamage(group, target) / target.hp);
    });

    // reset before the next fight
    groups = groups.filter(group => group.count > 0).map(({ chosen, target, ...group }) => group);
  }
  return groups;
};

export const part1 = input => combatArmies(input).map(({ count }) => count).sum();

const boost = (groups, damage) => groups.map(group => ({ ...group, damage: group.damage + (damage * (group.type !== 'Infection')) }));

export const part2 = input => {
  let boostDamage = 0;
  let appx = 100;
  let firstWin = false;

  for (;;) {
    boostDamage += appx;
    const groups = combatArmies(boost(input, boostDamage));
    if (groups[0].type !== 'Infection') {
      firstWin = true;
      // it's a win
      if (appx === 1) {
        return groups.map(({ count }) => count).sum();
      }
      appx = -Math.max(Math.round(Math.abs(appx) / 2), 1);
    } else {
      appx = firstWin ? Math.max(1, Math.round(Math.abs(appx) / 2)) : appx * 2;
    }
  }
};
