export const formatInput = input => input.split('\n');

const toDecimal = snafu => snafu.split('').reverse().sum((value, i) => {
  if (value === '-') {
    value = -1;
  } else if (value === '=') {
    value = -2;
  }
  return value * 5 ** i;
});

const toSNAFU = num => {
  let pow = 0;
  while (5 ** (pow + 1) < num) {
    pow += 1;
  }

  let snafu = [];
  for (let i = pow; i >= 0; i -= 1) {
    const mul = 5 ** i;
    const value = Math.floor(num / mul);
    snafu.push(value);
    num -= value * mul;
  }

  let add = false;
  for (let i = snafu.length - 1; i >= 0; i -= 1) {
    let value = snafu[i] + +add;
    add = value > 2;

    if (add) {
      value %= 5;
      if (value === 4) {
        value = '-';
      } else if (value === 3) {
        value = '=';
      }
    }
    snafu[i] = value;
  }
  return snafu.join('');
};

export const part1 = input => toSNAFU(input.sum(toDecimal));

// There is no coding challenge for the part 2, yay :)
export const part2 = input => part1(input);
