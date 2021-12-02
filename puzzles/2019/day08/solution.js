const formatInput = input => input;

const getLayers = (input, w, h) => {
  const layerSize = w * h;
  const layers = [];
  let pointer = 0;

  do {
    layers.push(input.substr(pointer, layerSize));
    pointer += layerSize;
  } while (pointer < input.length);

  return layers;
};

const countChars = (layer, char) => layer.split('').filter(c => c === char).length;

const part1 = input => {
  const layers = getLayers(input, 25, 6);
  const zeroCounts = layers.map(layer => countChars(layer, '0'));
  const index = zeroCounts.indexOf(Math.min(...zeroCounts));
  return countChars(layers[index], '1') * countChars(layers[index], '2');
};

const part2 = input => {
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

module.exports = { part1, part2, formatInput };
