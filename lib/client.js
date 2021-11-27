const axios = require('axios');
const url = require('url');

const getUrl = (year, day, path) => ['', year, 'day', day, path].filter(value => value != null).join('/');

const client = axios.create({
  baseURL: 'https://adventofcode.com/',
  headers: { Cookie: `session=${process.env.SESSION_COOKIE}` },
});

const getInput = (year, day) => client.get(getUrl(year, day, 'input'), {
  responseType: 'text',
  transitional: { forcedJSONParsing: false },
});

const submitAnswer = async (year, day, level, answer) => {
  const params = new url.URLSearchParams({ level, answer });
  const { data } = await client.post(getUrl(year, day, 'answer'), params.toString(), {
    header: { 'content-type': 'application/x-www-form-urlencoded' },
  });

  if (!data.includes('That\'s the right answer')) {
    const errorMessage = data.match(/p>(.+)<a/)?.[1]?.trim();
    throw new Error(errorMessage || data);
  }
};

const getHtml = async (year, day) => {
  const { data } = await client.get(getUrl(year, day), {
    responseType: 'html',
    transitional: { forcedJSONParsing: false },
  });
  return data;
};

module.exports = {
  getInput,
  submitAnswer,
  getHtml,
};
