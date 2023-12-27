export const formatInput = input => {
  const [initial, notes] = input.split('\n\n');
  return {
    plants: initial.replace('initial state:', '').trim().replaceAll('.', '0'),
    notes: notes.split('\n').map(note => {
      const [pattern, result] = note.replaceAll('.', '0').split(' => ');
      return [new RegExp(pattern, 'g'), result];
    }),
  };
};

const getNextGeneration = (plants, notes) => {
  const layout = `000${plants}000`;
  let nextLayout = new Array(layout.length).fill('0');

  notes.forEach(([pattern, result]) => {
    let match = true;
    do {
      match = pattern.exec(layout);
      if (match) {
        nextLayout[match.index + 2] = result;
        pattern.lastIndex = match.index + 1;
      }
    } while (match);
  });
  const firstPlant = nextLayout.indexOf('#');
  return [nextLayout.slice(firstPlant, nextLayout.lastIndexOf('#') + 1).join(''), firstPlant - 3];
};

const getResult = (generation, index) => generation.split('').map((plant, i) => (plant === '#' ? i + index : 0)).sum();

const getPlantGenerationsCount = (count, plants, notes) => {
  let generation = plants;
  let index = 0;
  let shift;
  let prev;

  for (let i = 0; i < count; i += 1) {
    // run actual generation
    [generation, shift] = getNextGeneration(generation, notes);
    index += shift;
    if (i === count - 2) {
      prev = getResult(generation, index);
    }
  }
  return [getResult(generation, index), prev];
};

export const part1 = ({ plants, notes }) => getPlantGenerationsCount(20, plants, notes)[0];

export const part2 = ({ plants, notes }) => {
  const count = 1000;
  const [result, prevResult] = getPlantGenerationsCount(count, plants, notes);
  // At some point it starts to repeat
  return result + (result - prevResult) * (50000000000 - count);
};
