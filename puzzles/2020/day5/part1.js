const main = input => {
  const ids = input.split('\n').map(line => parseInt(line.replace(/F|L/g, 0).replace(/B|R/g, 1), 2));
  return Math.max(...ids);
};

module.exports = { main };
