const { readFile } = require('fs/promises');
const chalk = require('chalk');
const { getSolutionPath, getTestCasesPath } = require('./utils');

const validate = async (year, day, part, all) => {
  const testCases = JSON.parse(await readFile(getTestCasesPath(year, day), 'utf8'));

  const solution = require(`../${getSolutionPath(year, day, part)}`);

  testCases
    .filter(testCase => all || testCase.part === part)
    .forEach(async ({ input, answer }, index) => {
      const actualAnswer = await solution.main(input.trim());

      // eslint-disable-next-line eqeqeq -- we can compare strings to numbers here
      if (actualAnswer != answer) {
        console.log(chalk`Test case ${index + 1}: {red invalid}\n\n\tExpected:\t{dim {green ${answer}}}\n\tActual:\t\t{dim {red ${actualAnswer}}}\n`);
      } else {
        console.log(chalk`Test case ${index + 1}: {green valid}`);
      }
    });
};

module.exports = validate;
