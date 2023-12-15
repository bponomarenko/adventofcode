export const formatInput = input => input;

const getAllDivisors = num => {
  const divisors = [];
  for (let i = 1, l = Math.sqrt(num); i < l; i += 1) {
    if (num % i === 0) {
      divisors.push(i);

      const divisor = num / i;
      if (divisor !== i) {
        divisors.push(divisor);
      }
    }
  }
  return divisors.sort((a, b) => a - b);
};

export const part1 = input => {
  let presents = 0;
  let house = 2;
  while (presents <= input) {
    presents = getAllDivisors(house).sum(divisor => divisor * 10);
    house += 1;
  }
  return house - 1;
};

export const part2 = input => {
  const visited = new Map([[1, 1]]);
  let presents = 0;
  let house = 2;

  while (presents <= input) {
    presents = getAllDivisors(house)
      .filter(divisor => {
        visited.set(divisor, (visited.get(divisor) ?? 0) + 1);
        return visited.get(divisor) <= 50;
      })
      .sum(divisor => divisor * 11);
    house += 1;
  }
  return house - 1;
};
