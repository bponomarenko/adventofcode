const formatInput = input => input.split('\n');

const isValidPassport = passport => passport.size === 8 || (passport.size === 7 && !passport.has('cid'));

const part1 = input => {
  let validPassports = 0;
  let passport = new Set();

  input.forEach(line => {
    // Terminator string
    if (line.trim() === '') {
      if (isValidPassport(passport)) {
        validPassports += 1;
      }
      passport = new Set();
      return;
    }

    line.split(' ').forEach(field => {
      const [name, value] = field.split(':');
      passport.add(name, value);
    });
  });

  // Process the last passport
  if (isValidPassport(passport)) {
    validPassports += 1;
  }
  return validPassports;
};

const fieldsRe = {
  byr: /^19[2-9][0-9]|200[0-2]$/,
  iyr: /^20(1[0-9]|20)$/,
  eyr: /^20(2[0-9]|30)$/,
  hgt: /^(59|6[0-9]|7[0-6])in|(1([5-8][0-9]|9[0-3]))cm$/,
  hcl: /^#[a-z0-9]{6}$/,
  ecl: /^(amb|blu|brn|gry|grn|hzl|oth)$/,
  pid: /^\d{9}$/,
};

const isValidField = (name, value) => name === 'cid' || fieldsRe[name]?.test(value);

const part2 = input => {
  let validPassports = 0;
  let passport = new Set();

  input.forEach(line => {
    // Terminator string
    if (line.trim() === '') {
      if (isValidPassport(passport)) {
        validPassports += 1;
      }
      passport = new Set();
      return;
    }

    line.split(' ').forEach(field => {
      const [name, value] = field.split(':');
      if (isValidField(name, value)) {
        passport.add(name);
      }
    });
  });

  // Process the last passport
  if (isValidPassport(passport)) {
    validPassports += 1;
  }
  return validPassports;
};

module.exports = { part1, part2, formatInput };
