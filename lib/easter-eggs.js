const chalk = require('chalk');
const { getHtml } = require('./client');

// Those would be pieces of text with `<span title="Some info">...</span>` wrappers
const easterEggRegexp = /(.{5})<span title=".+">(.+)<\/span>(.{5})/g;

const findEasterEggs = async (year, day) => {
  const html = await getHtml(year, day);
  const matches = [...html.matchAll(easterEggRegexp)];

  const count = matches.length;
  if (count === 0) {
    console.log(chalk`{gray There are no easter eggs for this day.}`);
    return;
  }

  console.log(chalk`{green Found ${count} easter egg${count > 1 ? 's' : ''}: }`);
  matches.forEach(([, prefix, text, suffix], index) => {
    console.log(prefix, text, suffix);
    console.log(`${index + 1})  https://adventofcode.com/${year}/day/${day}#:~:text=${encodeURIComponent(prefix.trim())}-,${encodeURIComponent(text)},-${encodeURIComponent(suffix.trim())}`);
  });
};

module.exports = findEasterEggs;
