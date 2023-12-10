import axios from 'axios';
import url from 'url';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
import { ManagedError } from './utils.js';

// Populate configuration
dotenv.config();

const getUrl = (year, day, path) => ['', year, 'day', day, path].filter(value => value != null).join('/');

const client = axios.create({
  baseURL: 'https://adventofcode.com/',
  headers: {
    Cookie: `session=${process.env.SESSION_COOKIE}`,
    'Accept-Encoding': 'UTF-8',
  },
});

export const getInput = (year, day) => client.get(getUrl(year, day, 'input'), {
  responseType: 'text',
  transitional: { forcedJSONParsing: false },
});

export const submitAnswer = async (year, day, level, answer) => {
  const params = new url.URLSearchParams({ level, answer });
  const { data } = await client.post(getUrl(year, day, 'answer'), params.toString(), {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'content-length': params.toString().length,
    },
  });

  // Parse returned html to get response back
  const dom = new JSDOM(data);
  // Get text content from the first text node, so we won't include <a> text
  const responseText = dom.window.document.querySelector('main article p')?.childNodes?.[0]?.textContent;

  if (responseText.includes('That\'s the right answer')) {
    // Successfully solved!
    return { success: true };
  }

  if (responseText.startsWith('You don\'t seem to be solving the right level')) {
    // Was solved already
    return { alreadySolved: true };
  }

  if (day === 25 && level === 2) {
    // This was the last puzzle
    const asideText = dom.window.document.querySelector('main article p.aside')?.childNodes?.[0]?.textContent;
    if (asideText?.startsWith('Congratulations!')) {
      return { success: true };
    }
  }
  // Any other response is an errors
  throw new ManagedError(responseText || data);
};

export const getPuzzleHtml = async (year, day) => {
  const { data } = await client.get(getUrl(year, day), {
    responseType: 'document',
    transitional: { forcedJSONParsing: false },
  });
  return data;
};

export const getLeaderboardHtml = async year => {
  const { data } = await client.get(`/${year}/leaderboard/private/view/${process.env.LEADERBOARD_ID}`, {
    responseType: 'text',
    transitional: { forcedJSONParsing: false },
  });
  return data;
};
