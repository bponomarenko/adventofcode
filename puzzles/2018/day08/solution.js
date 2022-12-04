import { sum } from '../../utils/collections.js';

export const formatInput = input => input.split(' ').map(Number);

const readNode = data => {
  const node = { children: [] };
  let shift = 2;

  // read children nodes
  for (let i = 0; i < data[0]; i += 1) {
    const [child, childShift] = readNode(data.slice(shift));
    node.children.push(child);
    shift += childShift;
  }
  // read metadata
  node.meta = data.slice(shift, shift + data[1]);
  return [node, shift + data[1]];
};

const getNodeMeta = node => [...node.meta, ...node.children.flatMap(getNodeMeta)];

export const part1 = input => {
  const [tree] = readNode(input);
  return sum(getNodeMeta(tree));
};

const getNodeValue = node => {
  if (node.children.length) {
    const children = node.meta.map(value => node.children[value - 1]).filter(Boolean);
    return sum(children.map(getNodeValue));
  }
  return sum(node.meta);
};

export const part2 = input => {
  const [tree] = readNode(input);
  return getNodeValue(tree);
};
