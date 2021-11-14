const regex = /^(\d+)-(\d+)\s(.):\s(\w+)/;

const main = input => {
  const rules = input
    .split('\n')
    .map(line => {
      const [, min, max, char, password] = regex.exec(line);
      return {
        min: +min, max: +max, char, password,
      };
    })
    .filter(rule => {
      const length = rule.password.split(rule.char).length - 1;
      return length >= rule.min && length <= rule.max;
    });

  return rules.length;
};

module.exports = { main, regex };
