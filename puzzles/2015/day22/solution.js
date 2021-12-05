export const formatInput = input => input.split('\n').map(line => +line.split(': ')[1]);

const spells = {
  missile: {
    cost: 53,
    cast: (player, boss) => {
      boss.points -= 4;
    },
  },
  drain: {
    cost: 73,
    cast: (player, boss) => {
      boss.points -= 2;
      player.points += 2;
    },
  },
  shield: {
    cost: 113,
    cast: player => {
      player.shield = 6;
      player.armor = 7;
    },
    effect: player => {
      player.shield -= 1;
      if (!player.shield) {
        player.armor = 0;
      }
    },
  },
  poison: {
    cost: 173,
    cast: (player, boss) => {
      boss.poison = 6;
    },
    effect: boss => {
      boss.poison -= 1;
      boss.points -= 3;
    },
  },
  recharge: {
    cost: 229,
    cast: player => {
      player.recharge = 5;
    },
    effect: player => {
      player.recharge -= 1;
      player.mana += 101;
    },
  },
};

class Player {
  constructor(points, mana) {
    this.points = points;
    this.mana = mana;
    this.armor = 0;
    this.spent = 0;
    this.shield = 0;
    this.recharge = 0;
  }

  get serialized() {
    return `${this.points},${this.mana},${this.armor},${this.spent},${this.shield},${this.recharge}`;
  }

  static deserialize(str) {
    const values = str.split(',');
    const p = new Player(+values[0], +values[1]);
    p.armor = +values[2];
    p.spent = +values[3];
    p.shield = +values[4];
    p.recharge = +values[5];
    return p;
  }
}

class Boss {
  constructor(points, damage) {
    this.points = points;
    this.damage = damage;
    this.poison = 0;
  }

  get serialized() {
    return `${this.points},${this.damage},${this.poison}`;
  }

  static deserialize(str) {
    const values = str.split(',');
    const b = new Boss(+values[0], +values[1]);
    b.poison = +values[2];
    return b;
  }
}

const playerAttack = (player, boss, spellName) => {
  if (spellName) {
    const spell = spells[spellName];
    player.mana -= spell.cost;
    player.spent += spell.cost;
    spell.cast(player, boss);
  }
};

const bossAttack = (player, boss) => {
  player.points -= Math.max(boss.damage - player.armor, 1);
};

const getQueueOptions = (player, boss) => {
  const spellOptions = Object.entries(spells)
    .filter(([name, { cost }]) => player.mana >= cost && (player[name] ?? 0) <= 1 && (boss[name] ?? 0) <= 1)
    .map(([name]) => `${player.serialized}:${boss.serialized}:${name}`);
  return spellOptions.length ? spellOptions : [`${player.serialized}:${boss.serialized}`];
};

const applyEffects = (player, boss) => {
  Object.entries(spells).forEach(([name, { effect }]) => {
    if (effect) {
      if (player[name]) {
        effect(player);
      }
      if (boss[name]) {
        effect(boss);
      }
    }
  });
};

const findMinimumMana = (hitPoints, damage, roundFn) => {
  const queue = getQueueOptions(new Player(50, 500), new Boss(hitPoints, damage));
  const processed = new Set(queue);
  let min = Infinity;

  while (queue.length) {
    const [finish, data] = roundFn(queue.pop());

    if (finish) {
      if (data) {
        min = Math.min(min, data);
      }
    } else {
      data.forEach(option => {
        if (!processed.has(option)) {
          processed.add(option);
          queue.push(option);
        }
      });
    }
  }
  return min;
};

export const part1 = ([hitPoints, damage]) => findMinimumMana(hitPoints, damage, queueStr => {
  const [playerStr, bossStr, spell] = queueStr.split(':');
  const player = Player.deserialize(playerStr);
  const boss = Boss.deserialize(bossStr);

  applyEffects(player, boss);

  if (player.points > 0 && boss.points > 0) {
    playerAttack(player, boss, spell);
  }

  if (player.points > 0 && boss.points > 0) {
    applyEffects(player, boss);
  }

  if (player.points > 0 && boss.points > 0) {
    bossAttack(player, boss);
  }

  if (player.points > 0 && boss.points > 0) {
    return [false, getQueueOptions(player, boss)];
  }
  return [true, player.points > 0 && boss.points <= 0 ? player.spent : null];
});

export const part2 = ([hitPoints, damage]) => findMinimumMana(hitPoints, damage, queueStr => {
  const [playerStr, bossStr, spell] = queueStr.split(':');
  const player = Player.deserialize(playerStr);
  const boss = Boss.deserialize(bossStr);

  player.points -= 1;

  if (player.points > 0 && boss.points > 0) {
    applyEffects(player, boss);
  }

  if (player.points > 0 && boss.points > 0) {
    playerAttack(player, boss, spell);
  }

  player.points -= 1;

  if (player.points > 0 && boss.points > 0) {
    applyEffects(player, boss);
  }

  if (player.points > 0 && boss.points > 0) {
    bossAttack(player, boss);
  }

  if (player.points > 0 && boss.points > 0) {
    return [false, getQueueOptions(player, boss)];
  }
  return [true, player.points > 0 && boss.points <= 0 ? player.spent : null];
});
