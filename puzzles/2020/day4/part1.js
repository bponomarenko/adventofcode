const isValidPassport = passport => passport.size === 8 || (passport.size === 7 && !passport.has('cid'));

const main = input => {
  let validPassports = 0;
  let passport = new Set();

  input.split('\n').forEach(line => {
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

module.exports = { main, isValidPassport };
