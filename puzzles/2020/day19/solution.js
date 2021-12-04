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

export const formatInput = input => {
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

export const part1 = input => {
  const mainRule = assembleRule(input.rules, 0);
  const re = new RegExp(`^${mainRule}$`);
  return input.msgs.split('\n').filter(msg => re.test(msg)).length;
};

const assembleRule2 = (rules, ruleId) => {
  const def = rules.get(ruleId);
  if (Array.isArray(def)) {
    // Custom treatment for rule 11
    if (ruleId === 11) {
      const [[p1, p2]] = def;
      const a = assembleRule2(rules, +p1);
      const b = assembleRule2(rules, +p2);
      return `${a}(${a}(${a}(${a}${b})?${b})?${b})?${b}`;
    }
    const rule = def.map(subRules => subRules.map(id => assembleRule2(rules, +id)).join('')).join('|');
    // Rule * can appear mutliple times in a row
    if (ruleId === 8) {
      return `(${rule})+`;
    }
    return def.length === 1 ? rule : `(${rule})`;
  }
  return def;
};

export const part2 = input => {
  const mainRule = assembleRule2(input.rules, 0);
  const re = new RegExp(`^${mainRule}$`);
  return input.msgs.split('\n').filter(msg => re.test(msg)).length;
};
