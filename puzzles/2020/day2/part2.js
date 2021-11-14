const { regex } = require('./part1');

const main = input => {
  const rules = input
    .split('\n')
    .map(line => {
      const [, min, max, char, password] = regex.exec(line);
      return {
        min: +min, max: +max, char, password,
      };
    })
    // eslint-disable-next-line no-bitwise
    .filter(rule => rule.password[rule.min - 1] === rule.char ^ rule.password[rule.max - 1] === rule.char);

  return rules.length;
};

module.exports = { main };
