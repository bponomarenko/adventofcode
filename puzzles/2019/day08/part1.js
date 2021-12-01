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

const main = input => {
  const layers = getLayers(input, 25, 6);
  const zeroCounts = layers.map(layer => countChars(layer, '0'));
  const index = zeroCounts.indexOf(Math.min(...zeroCounts));
  return countChars(layers[index], '1') * countChars(layers[index], '2');
};

module.exports = {
  main: (input, isTest) => main(formatInput(input), isTest),
  formatInput,
  getLayers,
};
