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

  const tooSoonIndex = data.indexOf('You gave an answer too recently');
  if (tooSoonIndex !== -1) {
    const sentenceEndIndex = data.indexOf('.', tooSoonIndex);
    const waitTime = data.slice(sentenceEndIndex + 1, data.indexOf('.', sentenceEndIndex + 1) + 1).trim();
    throw new Error(`Cannot submit your answer yet. ${waitTime}`);
  }

  const wrongAnswerIndex = data.indexOf('That\'s not the right answer');
  if (wrongAnswerIndex !== -1) {
    const sentenceEndIndex = data.indexOf('.', wrongAnswerIndex);
    throw new Error(data.slice(wrongAnswerIndex, sentenceEndIndex).trim());
  }
};

module.exports = {
  getInput,
  submitAnswer,
};
