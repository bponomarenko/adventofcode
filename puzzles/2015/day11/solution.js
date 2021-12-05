export const formatInput = input => input;

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const straightRegex = /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/;
const restrictedRegex = /[iol]/;
const pairsRegex = /((\w)\2).*([^\1])\3/;

const isValid = password => straightRegex.test(password) && !restrictedRegex.test(password) && pairsRegex.test(password);

const increment = (password, i) => {
  const newPass = password.split('');
  if (newPass[i] === 'z') {
    newPass[i] = 'a';
    return increment(newPass.join(''), i - 1);
  }
  newPass[i] = alphabet[alphabet.indexOf(newPass[i]) + 1];

  return newPass.join('');
};

const getNextPassword = password => {
  let newPassword = password;
  do {
    newPassword = increment(newPassword, newPassword.length - 1);
  } while (!isValid(newPassword));
  return newPassword;
};

export const part1 = input => getNextPassword(input);

export const part2 = input => getNextPassword(getNextPassword(input));
