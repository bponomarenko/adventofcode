const main = input => {
  const ids = input.split('\n')
    .map(line => parseInt(line.replace(/F|L/g, 0).replace(/B|R/g, 1), 2))
    .sort((a, b) => a - b);

  for (let i = 1; i < ids.length - 1; i += 1) {
    if (ids[i] - ids[i - 1] > 1) {
      return ids[i] - 1;
    }
  }
  return null;
};

module.exports = { main };
