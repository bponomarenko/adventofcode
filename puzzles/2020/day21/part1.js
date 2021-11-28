const productRe = /^(?<ingridients>.*) \(contains (?<allergens>.*)\)$/;

const formatInput = input => input.split('\n').map(food => {
  const { ingridients, allergens } = productRe.exec(food).groups;
  return {
    ingridients: ingridients.split(' '),
    allergens: allergens.split(', '),
  };
});

const main = input => {
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

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
};
