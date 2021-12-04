const roomRegex = /^(?<name>[\w-]+)-(?<id>\d+)\[(?<checksum>\w+)\]$/;

export const formatInput = input => input.split('\n').map(line => roomRegex.exec(line)?.groups).filter(Boolean);

export const part1 = input => input
  .map(groups => {
    const chars = new Map();
    groups.name.replace(/-/g, '').split('').forEach(char => chars.set(char, (chars.get(char) ?? 0) + 1));
    let checksum = Array.from(chars.entries())
      .sort(([c1, i1], [c2, i2]) => (i2 === i1 ? c1.localeCompare(c2) : i2 - i1))
      .slice(0, groups.checksum.length)
      .map(([char]) => char)
      .join('');
    return checksum === groups.checksum ? +groups.id : null;
  })
  .filter(Boolean)
  .reduce((acc, id) => acc + id, 0);

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const getName = (encodedName, shift) => encodedName.split('')
  .map(char => (char === '-' ? ' ' : alphabet[(alphabet.indexOf(char) + shift) % alphabet.length]))
  .join('');

export const part2 = input => input
  .map(groups => {
    const chars = new Map();
    groups.name.replace(/-/g, '').split('').forEach(char => chars.set(char, (chars.get(char) ?? 0) + 1));
    let checksum = Array.from(chars.entries())
      .sort(([c1, i1], [c2, i2]) => (i2 === i1 ? c1.localeCompare(c2) : i2 - i1))
      .slice(0, groups.checksum.length)
      .map(([char]) => char)
      .join('');
    return checksum === groups.checksum ? { name: getName(groups.name, +groups.id), id: +groups.id } : null;
  })
  .filter(Boolean)
  .filter(({ name }) => name.includes('north'))[0]?.id;
