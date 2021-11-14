const axios = require('axios');
const url = require('url');

const client = axios.create({
  baseURL: 'https://adventofcode.com/',
  headers: { Cookie: `session=${process.env.SESSION_COOKIE}` },
});

const getInput = (year, day) => client.get(`/${year}/day/${day}/input`, {
  responseType: 'text',
  transitional: { forcedJSONParsing: false },
});

const submitAnswer = async (year, day, level, answer) => {
  const params = new url.URLSearchParams({ level, answer });
  const { data } = await client.post(`/${year}/day/${day}/answer`, params.toString(), {
    header: { 'content-type': 'application/x-www-form-urlencoded' },
  });

  if (!data.includes('That\'s the right answer')) {
    const errorMessage = data.match(/p>(.+)<a/)?.[1]?.trim();
    throw new Error(errorMessage || data);
  }
};

module.exports = {
  getInput,
  submitAnswer,
};
