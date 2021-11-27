const { formatInput } = require('./part1');

const assembleRule = (rules, ruleId) => {
  const def = rules.get(ruleId);
  if (Array.isArray(def)) {
    // Custom treatment for rule 11
    if (ruleId === 11) {
      const [[part1, part2]] = def;
      const a = assembleRule(rules, +part1);
      const b = assembleRule(rules, +part2);
      return `${a}(${a}(${a}(${a}${b})?${b})?${b})?${b}`;
    }
    const rule = def.map(subRules => subRules.map(id => assembleRule(rules, +id)).join('')).join('|');
    // Rule * can appear mutliple times in a row
    if (ruleId === 8) {
      return `(${rule})+`;
    }
    return def.length === 1 ? rule : `(${rule})`;
  }
  return def;
};

const main = input => {
  const mainRule = assembleRule(input.rules, 0);
  const re = new RegExp(`^${mainRule}$`);
  return input.msgs.split('\n').filter(msg => re.test(msg)).length;
};

module.exports = { main: input => main(formatInput(input)) };
