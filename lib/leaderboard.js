import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import { getLeaderboardHtml } from './client.js';

const getLeaderboardPosition = async (year, day, part) => {
  // Load actual page
  const html = await getLeaderboardHtml(year);
  // Render into virtual dom
  const dom = new JSDOM(html);
  const bothStars = `.privboard-row > .privboard-star-both:nth-child(${day + 1})`;
  const selector = part === 2 ? bothStars : `${bothStars}, .privboard-row > .privboard-star-firstonly:nth-child(${day + 1})`;
  // Find how many people (including me) already solved specified part of the day
  const count = dom.window.document.querySelectorAll(selector).length;
  console.log(chalk.blue(`(${count} people solved this part)`));
};

export default getLeaderboardPosition;
