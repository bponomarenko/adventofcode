const main = input => input.split('\n').reduce((acc, line) => {
  const nums = line.split(/\s+/).map(Number);
  return acc + Math.max(...nums) - Math.min(...nums);
}, 0);

module.exports = { main };
