import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import { getHtml } from './client.js';

const encode = text => encodeURIComponent(text.trim());

const findEasterEgg = async (year, day) => {
  // Load actual page
  const html = await getHtml(year, day);
  // Render into virtual dom
  const dom = new JSDOM(html);
  // Find element "easter egg" element
  const easterEgg = dom.window.document.querySelector('span[title]');

  if (!easterEgg) {
    console.log(chalk`{gray There are no easter eggs for this day.}`);
    return;
  }

  // Get prefix text
  let prefix = easterEgg.previousSibling?.textContent.slice(-20) || '';
  let whitespaceIndex = prefix.indexOf(' ');
  // Make sure it starts after the whitespace
  prefix = whitespaceIndex !== -1 ? prefix.slice(whitespaceIndex + 1) : prefix;

  // Get suffix text
  let suffix = easterEgg.nextSibling?.textContent.slice(0, 20) || '';
  whitespaceIndex = suffix.lastIndexOf(' ');
  // Make sure it starts after the whitespace
  suffix = whitespaceIndex !== -1 ? suffix.slice(0, whitespaceIndex) : suffix;

  console.log(chalk`\n{cyan Here is your link to the easter egg of today:}`);
  console.log(`https://adventofcode.com/${year}/day/${day}#:~:text=${encode(prefix)}-,${encode(easterEgg.textContent)},-${encode(suffix)}`);
};

export default findEasterEgg;
