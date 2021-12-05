export const formatInput = input => input.split('\n').map(line => +line.split(': ')[1]);

const re = /^(?<name>\w+(\s\+\d)?)\s+(?<cost>\d+)\s+(?<damage>\d+)\s+(?<armor>\d+)$/;

const toObject = callSite => callSite[0].split('\n').filter(Boolean).map(line => {
  const { groups } = re.exec(line);
  return { name: groups.name, cost: +groups.cost, damage: +groups.damage, armor: +groups.armor };
});

const weapons = toObject`
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0`;

const armor = toObject`
None          0     0       0
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5`;

const rings = toObject`
None          0     0       0
Damage +1    25     1       0
Damage +2    50     2       0
Damage +3   100     3       0
Defense +1   20     0       1
Defense +2   40     0       2
Defense +3   80     0       3`;

class Player {
  constructor(hitPoints, damage, armorLevel) {
    this.hitPoints = hitPoints;
    this.damage = damage ?? 0;
    this.armor = armorLevel ?? 0;
    this.goldSpent = 0;
    this.equipment = [];
  }

  addEquipment(equipment) {
    if (equipment) {
      this.equipment.push(equipment);
      this.damage += equipment.damage;
      this.armor += equipment.armor;
      this.goldSpent += equipment.cost;
    }
  }
}

const playMatch = (equipment, hitPoints, damage, armorLevel) => {
  const boss = new Player(hitPoints, damage, armorLevel);
  const me = new Player(100);
  equipment.forEach(e => me.addEquipment(e));

  const roundsToWin = Math.ceil(boss.hitPoints / Math.max(me.damage - boss.armor, 1));
  const roundsToLoss = Math.ceil(me.hitPoints / Math.max(boss.damage - me.armor, 1));
  return [roundsToWin <= roundsToLoss, me.goldSpent];
};

export const part1 = input => {
  const goldSpendings = [];
  weapons.forEach(weapon => armor
    .forEach(armorItem => rings
      .forEach((ring1, i1) => rings
        .forEach((ring2, i2) => {
          const [win, gold] = playMatch([weapon, armorItem, ring1, i1 !== i2 ? ring2 : null], ...input);
          if (win) {
            goldSpendings.push(gold);
          }
        }))));
  return Math.min(...goldSpendings);
};

const playMatch2 = (equipment, hitPoints, damage, armorLevel) => {
  const boss = new Player(hitPoints, damage, armorLevel);
  const me = new Player(100);
  equipment.forEach(e => me.addEquipment(e));

  const roundsToWin = Math.ceil(boss.hitPoints / Math.max(me.damage - boss.armor, 1));
  const roundsToLoss = Math.ceil(me.hitPoints / Math.max(boss.damage - me.armor, 1));
  return [roundsToWin > roundsToLoss, me.goldSpent];
};

export const part2 = input => {
  const goldSpendings = new Set();

  weapons.forEach(weapon => armor
    .forEach(armorItem => rings
      .forEach((ring1, i1) => rings
        .forEach((ring2, i2) => {
          const [loss, gold] = playMatch2([weapon, armorItem, ring1, i1 === i2 ? null : ring2], ...input);
          if (loss) {
            goldSpendings.add(gold);
          }
        }))));
  return Math.max(...goldSpendings);
};
