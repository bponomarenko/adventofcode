export const formatInput = input => {
  const links = new Map();
  const pairs = [];
  input.split('\n').forEach(row => {
    const [c1, c2] = row.split('-');
    pairs.push([c1, c2]);
    links.set(c1, (links.get(c1) ?? []).concat(c2));
    links.set(c2, (links.get(c2) ?? []).concat(c1));
  });
  return [links, pairs];
};

export const part1 = ([links]) => {
  const hubs = new Set();
  Array.from(links.entries()).forEach(([c1, c1links]) => {
    c1links.forEach(c2 => {
      links.get(c2).forEach(c3 => {
        if (c3 !== c1 && (c1.at(0) === 't' || c2.at(0) === 't' || c3.at(0) === 't') && links.get(c3).includes(c1)) {
          hubs.add([c1, c2, c3].toSorted().join(','));
        }
      });
    });
  });
  return hubs.size;
};

export const part2 = ([links, pairs]) => {
  const hubs = [];
  pairs.forEach(([c1, c2]) => {
    const computers = hubs.find(hub => hub.every(computer => {
      const cLinks = links.get(computer);
      return (computer === c1 || cLinks.includes(c1)) && (computer === c2 || cLinks.includes(c2));
    }));
    if (computers) {
      computers.push(c1, c2);
    } else {
      hubs.push([c1, c2]);
    }
  });

  let biggestHub;
  hubs.forEach(hub => {
    const unique = hub.unique();
    if (!biggestHub || unique.length > biggestHub.length) {
      biggestHub = unique.toSorted();
    }
  });
  return biggestHub.join(',');
};
