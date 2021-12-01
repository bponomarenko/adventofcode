const { formatInput, getLayers } = require('./part1');

const main = input => {
  const width = 25;
  const height = 6;
  const layers = getLayers(input, width, height).map(layer => layer.split(''));
  const arr = Array(width * height).fill(null);

  const result = layers.reduce((finalLayer, layer) => finalLayer.map((char, index) => (!char && layer[index] !== '2' ? layer[index] : char)), arr).join('');

  for (let i = 0; i < result.length; i += width) {
    // Print ASCII art with the answer on the screen this time!
    console.log(result.substr(i, width).replace(/1/g, '*').replace(/0/g, ' '));
  }
};

module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
