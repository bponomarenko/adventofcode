const chalk = require('chalk');
const { getHtml } = require('./client');

// Those would be pieces of text with `<span title="Some info">...</span>` wrappers
const easterEggRegexp = /<span title=".+">(.+)<\/span>/g;

const findEasterEggs = async (year, day) => {
  const html = await getHtml(year, day);
  const matches = [...html.matchAll(easterEggRegexp)];

  const count = matches.length;
  if (count === 0) {
    console.log(chalk`{gray There are no easter eggs for this day.}`);
    return;
  }

  console.log(chalk`{green Found ${count} easter egg${count > 1 ? 's' : ''}: }`);
  matches.forEach(([, text], index) => {
    console.log(`${index + 1})  https://adventofcode.com/${year}/day/${day}#:~:text=-,${encodeURIComponent(text)},-`);
  });
};

module.exports = findEasterEggs;
