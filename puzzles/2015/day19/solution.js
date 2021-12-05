export const formatInput = input => {
  const [replacements, molecule] = input.split('\n\n');
  return [
    replacements.split('\n').map(str => str.split(' => ')),
    molecule,
  ];
};

export const part1 = ([input, molecule]) => {
  const molecules = new Set();

  input.forEach(([src, replacement]) => {
    const re = new RegExp(src, 'g');
    let match = re.exec(molecule);

    while (match) {
      molecules.add(`${molecule.slice(0, match.index)}${replacement}${molecule.slice(match.index + src.length)}`);
      match = re.exec(molecule);
    }
  });
  return molecules.size;
};

export const part2 = ([replacements, molecule]) => {
  let m = molecule;
  let count = 0;

  replacements.sort((r1, r2) => (r1[1].length === r2[1].length ? r1[0].length - r2[0].length : r2[1].length - r1[1].length));

  while (m !== 'e' && count < 1000) {
    const [src, replacement] = replacements.find(([, repl]) => m.includes(repl));
    m = m.replace(replacement, src);
    count += 1;
  }
  return count;
};
