export const formatInput = input => input.toGrid('\n', ' ');

// Use Set to make sure word is unique
export const part1 = input => input.sum(phrase => (new Set(phrase).size === phrase.length ? 1 : 0));

export const part2 = input => {
  // Arrange letters in each word, and then assert its uniqueness
  const rearranged = input.map(phrase => phrase.map(word => word.split('').sort().join('')));
  return rearranged.sum(phrase => (new Set(phrase).size === phrase.length ? 1 : 0));
};
