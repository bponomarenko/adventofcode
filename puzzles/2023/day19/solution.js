export const formatInput = input => {
  const [workflows, parts] = input.split('\n\n');
  const workflowEntries = workflows.split('\n').map(rule => [
    rule.slice(0, rule.indexOf('{')),
    rule.slice(rule.indexOf('{') + 1, -1).split(',')
      .map(cond => {
        if (cond.includes(':')) {
          const [eq, target] = cond.split(':');
          const comp = eq.includes('>') ? '>' : '<';
          const [name, value] = eq.split(comp);
          return { name, comp, value: +value, target };
        }
        return { target: cond };
      }),
  ]);

  return {
    workflows: Object.fromEntries(workflowEntries),
    parts: parts.split('\n').map(part => {
      const entries = part.slice(1, -1).split(',').map(prop => {
        const [name, value] = prop.split('=');
        return [name, +value];
      });
      return Object.fromEntries(entries);
    }),
  };
};

const countAcceptedParts = (workflows, startPart) => {
  const queue = [{ workflow: 'in', part: startPart }];
  let accepted = 0;

  while (queue.length) {
    const { workflow, part } = queue.shift();

    if (workflow === 'A') {
      accepted += Object.values(part).map(([start, end]) => end - start + 1).power();
      continue;
    } else if (workflow === 'R') {
      continue;
    }

    const conditions = Array.from(workflows[workflow]);
    while (conditions.length) {
      const { name, comp, value, target } = conditions.shift();
      if (comp === '<') {
        const [start, end] = part[name];
        if (start < value) {
          if (end < value) {
            queue.push({ workflow: target, part });
            break;
          }
          queue.push({ workflow: target, part: { ...part, [name]: [start, value - 1] } });
          part[name] = [value, end];
        }
        continue;
      }

      if (comp === '>') {
        const [start, end] = part[name];
        if (end > value) {
          if (start > value) {
            queue.push({ workflow: target, part });
            break;
          }
          queue.push({ workflow: target, part: { ...part, [name]: [value + 1, end] } });
          part[name] = [start, value];
        }
        continue;
      }

      if (target !== 'R') {
        queue.push({ workflow: target, part });
      }
    }
  }
  return accepted;
};

export const part1 = ({ parts, workflows }) => parts
  .filter(part => {
    const entries = Object.entries(part).map(([name, value]) => [name, [value, value]]);
    return countAcceptedParts(workflows, Object.fromEntries(entries)) > 0;
  })
  .map(part => Object.values(part).sum())
  .sum();

export const part2 = ({ workflows }) => countAcceptedParts(workflows, { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] });
