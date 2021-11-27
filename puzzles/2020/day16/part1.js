const formatInput = input => {
  const [rulesRaw, ticketRaw, ticketsRaw] = input.split('\n\n');
  return { rulesRaw: rulesRaw.split('\n'), ticketRaw, ticketsRaw };
};

const ruleRe = /^(?<field>.+): (?<min1>\d+)-(?<max1>\d+) or (?<min2>\d+)-(?<max2>\d+)$/;
const isValidValue = (rules, value) => rules.some(rule => (value >= rule.min1 && value <= rule.max1) || (value >= rule.min2 && value <= rule.max2));

const main = input => {
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

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
  ruleRe,
};
