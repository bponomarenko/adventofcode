export const formatInput = input => {
  const [rulesRaw, ticketRaw, ticketsRaw] = input.split('\n\n');
  return { rulesRaw: rulesRaw.split('\n'), ticketRaw, ticketsRaw };
};

const ruleRe = /^(?<field>.+): (?<min1>\d+)-(?<max1>\d+) or (?<min2>\d+)-(?<max2>\d+)$/;
const isValidValue = (rules, value) => rules.some(rule => (value >= rule.min1 && value <= rule.max1) || (value >= rule.min2 && value <= rule.max2));

export const part1 = input => {
  const rules = input.rulesRaw.map(line => {
    const entries = Object.entries(ruleRe.exec(line).groups)
      .map(([name, value]) => (name === 'field' ? [name, value] : [name, +value]));
    return Object.fromEntries(entries);
  });

  let sum = 0;
  input.ticketsRaw.replace('nearby tickets:\n', '').split('\n').forEach(ticket => {
    ticket.split(',').forEach(value => {
      if (!isValidValue(rules, +value)) {
        sum += +value;
      }
    });
  });
  return sum;
};

const isValidValue2 = (rule, value) => (value >= rule.min1 && value <= rule.max1) || (value >= rule.min2 && value <= rule.max2);

const isValidTicket = (rules, ticket) => ticket.every(value => rules.some(rule => isValidValue2(rule, value)));

const findRuleIndex = (rules, indexShift, tickets, valueIndex) => rules
  .findIndex((rule, i) => i > indexShift && tickets.every(ticket => isValidValue2(rule, ticket[valueIndex])));

const sortRules = (rules, tickets, valueIndex = 0) => {
  let indexShift = -1;
  do {
    const index = findRuleIndex(rules, indexShift, tickets, valueIndex);
    if (index === -1) {
      return null;
    }

    const clonedRules = [...rules];
    const [firstRule] = clonedRules.splice(index, 1);
    if (!clonedRules.length) {
      return [firstRule];
    }

    const remainingRules = sortRules(clonedRules, tickets, valueIndex + 1);
    if (remainingRules) {
      return [firstRule, ...remainingRules];
    }
    indexShift = index;
  // eslint-disable-next-line no-constant-condition
  } while (true);
};

export const part2 = input => {
  const rules = input.rulesRaw.map(line => {
    const entries = Object.entries(ruleRe.exec(line).groups)
      .map(([name, value]) => (name === 'field' ? [name, value] : [name, +value]));
    return Object.fromEntries(entries);
  });

  const tickets = input.ticketsRaw
    .replace('nearby tickets:\n', '')
    .split('\n')
    .map(ticket => ticket.split(',').map(value => +value))
    .filter(ticket => isValidTicket(rules, ticket));

  const sortedRules = sortRules(rules, tickets);
  const myTicket = input.ticketRaw.replace('your ticket:\n', '').split(',').map(value => +value);
  return sortedRules.reduce((acc, { field }, i) => (field.startsWith('departure ') ? acc * myTicket[i] : acc), 1);
};
