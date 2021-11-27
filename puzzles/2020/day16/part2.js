const { formatInput, ruleRe } = require('./part1');

const isValidValue = (rule, value) => (value >= rule.min1 && value <= rule.max1) || (value >= rule.min2 && value <= rule.max2);

const isValidTicket = (rules, ticket) => ticket.every(value => rules.some(rule => isValidValue(rule, value)));

const findRuleIndex = (rules, indexShift, tickets, valueIndex) => rules
  .findIndex((rule, i) => i > indexShift && tickets.every(ticket => isValidValue(rule, ticket[valueIndex])));

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

const main = input => {
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

module.exports = { main: input => main(formatInput(input)) };
