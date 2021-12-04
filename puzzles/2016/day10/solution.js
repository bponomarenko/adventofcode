export const formatInput = input => input.split('\n');

const assignRe = /^value (\d+) goes to bot (\d+)$/;
const transferRe = /^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/;

const hasPendinTransfers = bots => Array.from(bots.values()).some(bot => bot.chips.length === 2 && bot.instructions.length);

const getBot = (bots, id) => {
  if (!bots.has(id)) {
    bots.set(id, { instructions: [], chips: [] });
  }
  return bots.get(id);
};

const getInstruction = (lowBot, lowId, highBot, highId) => (bots, outputs, bot) => {
  if (bot.chips.includes(17) && bot.chips.includes(61)) {
    return true;
  }
  getBot(lowBot ? bots : outputs, lowId).chips.push(Math.min(...bot.chips));
  getBot(highBot ? bots : outputs, highId).chips.push(Math.max(...bot.chips));
  bot.chips.length = 0;
  return false;
};

export const part1 = instructions => {
  const bots = new Map();
  const outputs = new Map();

  while (instructions.length || hasPendinTransfers(bots)) {
    while (hasPendinTransfers(bots)) {
      for (let [id, bot] of bots) {
        if (bot.chips.length === 2 && bot.instructions.length) {
          const instr = bot.instructions.shift();
          if (instr(bots, outputs, bot)) {
            return id;
          }
        }
      }
    }

    if (instructions.length) {
      const instruction = instructions.shift();
      let match;

      // eslint-disable-next-line no-cond-assign
      if (match = assignRe.exec(instruction)) {
        getBot(bots, match[2]).chips.push(+match[1]);
      // eslint-disable-next-line no-cond-assign
      } else if (match = transferRe.exec(instruction)) {
        getBot(bots, match[1])
          .instructions
          .push(getInstruction(match[2] === 'bot', match[3], match[4] === 'bot', match[5]));
      }
    }
  }
  return null;
};

const getInstruction2 = (lowBot, lowId, highBot, highId) => (bots, outputs, bot) => {
  getBot(lowBot ? bots : outputs, lowId).chips.push(Math.min(...bot.chips));
  getBot(highBot ? bots : outputs, highId).chips.push(Math.max(...bot.chips));
  bot.chips.length = 0;
};

export const part2 = instructions => {
  const bots = new Map();
  const outputs = new Map();

  while (instructions.length || hasPendinTransfers(bots)) {
    while (hasPendinTransfers(bots)) {
      for (let [, bot] of bots) {
        if (bot.chips.length === 2 && bot.instructions.length) {
          const instr = bot.instructions.shift();
          instr(bots, outputs, bot);
        }
      }
    }

    if (instructions.length) {
      const instruction = instructions.shift();
      let match;

      // eslint-disable-next-line no-cond-assign
      if (match = assignRe.exec(instruction)) {
        getBot(bots, match[2]).chips.push(+match[1]);
      // eslint-disable-next-line no-cond-assign
      } else if (match = transferRe.exec(instruction)) {
        getBot(bots, match[1])
          .instructions
          .push(getInstruction2(match[2] === 'bot', match[3], match[4] === 'bot', match[5]));
      }
    }
  }
  return outputs.get('0').chips[0] * outputs.get('1').chips[0] * outputs.get('2').chips[0];
};
