const productRe = /^(?<ingridients>.*) \(contains (?<allergens>.*)\)$/;

const formatInput = input => input.split('\n').map(food => {
  const { ingridients, allergens } = productRe.exec(food).groups;
  return {
    ingridients: ingridients.split(' '),
    allergens: allergens.split(', '),
  };
});

const part1 = input => {
  const probabilities = new Map();
  const usageCount = new Map();

  input.forEach(({ ingridients, allergens }) => {
    ingridients.forEach(ingridient => {
      usageCount.set(ingridient, (usageCount.get(ingridient) ?? 0) + 1);

      const probability = (1 / ingridients.length) * (1 / allergens.length);
      const probs = probabilities.get(ingridient) ?? new Map();
      allergens.forEach(allergen => {
        probs.set(allergen, Math.max(probability, probs.get(allergen) ?? 0));
      });
      probabilities.set(ingridient, probs);
    });
  });

  const allergens = new Set();
  let count = 0;

  Array.from(usageCount.entries())
    .sort(([, count1], [, count2]) => count2 - count1)
    .forEach(([ingridient]) => {
      const probs = probabilities.get(ingridient);

      const probableAllergen = Array.from(probs.entries())
        .filter(([allergen]) => !allergens.has(allergen))
        .sort(([, prob1], [, prob2]) => prob2 - prob1)[0];

      if (probableAllergen) {
        allergens.add(probableAllergen[0]);
      } else {
        count += usageCount.get(ingridient);
      }
    });
  return count;
};

const part2 = input => {
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

module.exports = { part1, part2, formatInput };
