const mapValue = value => (value === '#' ? 1 : 0);

export const formatInput = input => {
  const [algorithm, image] = input.split('\n\n');
  return [algorithm.split('').map(mapValue), image.split('\n').map(line => line.split('').map(mapValue))];
};

const expand = image => {
  const newSize = image.length + 2;
  return [
    new Array(newSize).fill(0),
    ...image.map(line => [0, ...line, 0]),
    new Array(newSize).fill(0),
  ];
};

const getPixelValue = (image, x, y, algorithm, placeholder) => {
  const bits = [
    image[x - 1]?.[y - 1] ?? placeholder,
    image[x - 1]?.[y] ?? placeholder,
    image[x - 1]?.[y + 1] ?? placeholder,
    image[x]?.[y - 1] ?? placeholder,
    image[x]?.[y] ?? placeholder,
    image[x]?.[y + 1] ?? placeholder,
    image[x + 1]?.[y - 1] ?? placeholder,
    image[x + 1]?.[y] ?? placeholder,
    image[x + 1]?.[y + 1] ?? placeholder,
  ].join('');
  return algorithm[parseInt(bits, 2)];
};

const enhance = (image, algorithm, count) => {
  let placeholder = 0;
  for (let i = 0; i < count; i += 1) {
    image = expand(image).map((line, x) => line.map((_, y) => getPixelValue(image, x - 1, y - 1, algorithm, placeholder)));
    // ...being careful to account for the infinite size of the images
    placeholder = placeholder ? algorithm[algorithm.length - 1] : algorithm[0];
  }
  return image.reduce((acc, line) => acc + line.filter(Boolean).length, 0);
};

export const part1 = ([algorithm, image]) => enhance(image, algorithm, 2);

export const part2 = ([algorithm, image]) => enhance(image, algorithm, 50);
