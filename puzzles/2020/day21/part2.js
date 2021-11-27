const { formatInput } = require('./part1');

const main = input => {
  const possibleAllergens = new Map();

  input.forEach(({ ingridients, allergens }) => {
    allergens.forEach(allergen => {
      if (possibleAllergens.has(allergen)) {
        const newSet = ingridients.filter(ingridient => possibleAllergens.get(allergen).includes(ingridient));
        possibleAllergens.set(allergen, newSet);
      } else {
        possibleAllergens.set(allergen, Array.from(ingridients));
      }
    });
  });

  const allergens = new Map();
  while (possibleAllergens.size) {
    possibleAllergens.forEach((ingridients, allergen) => {
      const remainingIngridients = ingridients.filter(ingridient => !allergens.has(ingridient));
      if (remainingIngridients.length === 1) {
        allergens.set(remainingIngridients[0], allergen);
        possibleAllergens.delete(allergen);
      }
    });
  }

  return Array.from(allergens.entries())
    .sort(([, a1], [, a2]) => a1.localeCompare(a2))
    .map(([ingridient]) => ingridient)
    .join(',');
};

module.exports = { main: input => main(formatInput(input)) };
