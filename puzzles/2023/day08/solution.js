import { getLCM } from '../../utils/collections.js';

export const formatInput = input => {
  const [cmd, maps] = input.split('\n\n');
  return [
    cmd.split(''),
    Object.fromEntries(maps.split('\n').map(line => {
      const [start, end] = line.split(' = ');
      return [start, end.slice(1, -1).split(', ')];
    })),
  ];
};

const countSteps = (startNode, cmd, nodes, isFinished) => {
  const maxCmdIndex = cmd.length - 1;
  let index = 0;
  let node = startNode;
  let steps = 0;
  while (!isFinished(node)) {
    node = nodes[node][cmd[index] === 'L' ? 0 : 1];
    index = index === maxCmdIndex ? 0 : index + 1;
    steps += 1;
  }
  return steps;
};

export const part1 = ([cmd, nodes]) => countSteps('AAA', cmd, nodes, node => node === 'ZZZ');

export const part2 = ([cmd, nodes]) => {
  const startNodes = Object.keys(nodes).filter(node => node.endsWith('A'));
  const steps = startNodes.map(node => countSteps(node, cmd, nodes, n => n.endsWith('Z')));
  return getLCM(steps);
};
