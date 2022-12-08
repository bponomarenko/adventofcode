import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import { getPuzzleHtml } from './client.js';

const encode = text => encodeURIComponent(text.trim()).replaceAll('-', '%2D');
const getSibling = (elem, prev) => {
  let node = elem;
  while (!(prev ? node.previousSibling : node.nextSibling)) {
    node = elem.parentElement;
  }
  return prev ? node.previousSibling : node.nextSibling;
};

const prefixSize = 13;
const suffixSize = 17;

const findEasterEgg = async (year, day) => {
  // Load actual page
  const html = await getPuzzleHtml(year, day);
  // Render into virtual dom
  const dom = new JSDOM(html);
  // Find "easter egg" element
  const easterEgg = dom.window.document.querySelector('span[title]');

  if (!easterEgg) {
    console.log(chalk.gray('There are no easter eggs for this day.'));
    return;
  }

  // Get prefix text
  let prefix = getSibling(easterEgg, true).textContent.slice(-prefixSize) || '';
  let whitespaceIndex = prefix.indexOf(' ');
  // Make sure it starts after the whitespace
  prefix = whitespaceIndex !== -1 ? prefix.slice(whitespaceIndex + 1) : prefix;

  // Get suffix text
  let suffix = getSibling(easterEgg).textContent.slice(0, suffixSize) || '';
  whitespaceIndex = suffix.lastIndexOf(' ');
  // Make sure it starts after the whitespace
  suffix = whitespaceIndex !== -1 ? suffix.slice(0, whitespaceIndex) : suffix;

  console.log(chalk.blue('\nHere is your link to the easter egg of today:'));
  console.log(`https://adventofcode.com/${year}/day/${day}#:~:text=${encode(prefix)}-,${encode(easterEgg.textContent)},-${encode(suffix)}`);
};

export default findEasterEgg;
