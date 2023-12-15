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
  return getNodeMeta(tree).sum();
};

const getNodeValue = node => {
  if (node.children.length) {
    return node.meta
      .map(value => node.children[value - 1])
      .filter(Boolean)
      .map(getNodeValue)
      .sum();
  }
  return node.meta.sum();
};

export const part2 = input => getNodeValue(readNode(input)[0]);
