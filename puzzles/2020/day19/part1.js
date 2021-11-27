const parseRules = raw => {
  const rules = new Map();
  raw.split('\n').forEach(rule => {
    const [index, def] = rule.split(': ');
    if (def.includes('"')) {
      // eslint-disable-next-line no-eval
      rules.set(+index, eval(def));
    } else {
      rules.set(+index, def.split(' | ').map(subRules => subRules.split(' ')));
    }
  });
  return rules;
};

const formatInput = input => {
  const [rulesRaw, msgs] = input.split('\n\n');
  return { rules: parseRules(rulesRaw), msgs };
};

const assembleRule = (rules, ruleId) => {
  const def = rules.get(ruleId);
  if (Array.isArray(def)) {
    const rule = def.map(subRules => subRules.map(id => assembleRule(rules, +id)).join('')).join('|');
    return `(${rule})`;
  }
  return def;
};

const main = input => {
  const mainRule = assembleRule(input.rules, 0);
  const re = new RegExp(`^${mainRule}$`);
  return input.msgs.split('\n').filter(msg => re.test(msg)).length;
};

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
};
