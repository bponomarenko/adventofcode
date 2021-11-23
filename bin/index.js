#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const nodemon = require('nodemon');
const { readInput } = require('../lib/utils');
require('dotenv').config();

const withDayAndYear = command => command
  .option('-y, --year <year>', 'Year of the puzzle to scaffold', Number, process.env.YEAR ? +process.env.YEAR : new Date().getFullYear())
  .option('-d, --day <day>', 'Day of the puzzle to scaffold', Number, new Date().getDate());

const runCommand = async (name, args, watch) => {
  if (watch && !process.env.STATIC) {
    return new Promise(resolve => {
      nodemon({
        script: 'bin/index.js',
        args: program.args,
        env: { STATIC: true },
        ext: 'js,json',
      })
        .on('start', () => console.log(chalk.gray('Restarting')))
        .on('quit', () => resolve())
        .on('exit', () => resolve());

      // eslint-disable-next-line no-process-exit -- make sure nodemon is stopped on the first Ctrl+C
      process.on('SIGINT', () => process.exit());
    });
  }
  const command = require(`../lib/${name}`);
  return command(...args);
};

withDayAndYear(program.command('init'))
  .description('Scaffolds necessary files for a specific puzzle of the day and year')
  .action(({ year, day }) => runCommand('init', [year, day]));

withDayAndYear(program.command('solve'))
  .argument('<part>', 'Defines which part of the solution to run – part 1 or part 2', Number)
  .description('Runs puzzle solution code with specified input and prints the answer')
  .option('-s, --submit', 'Would try to submit found answer')
  .option('-w, --watch', 'Runs solution in a watch mode. Helpful for development')
  .option('-v, --validate', 'Also run validation test cases, and then solve a solution if cases are valid')
  .action((part, args) => runCommand('solve', [args.year, args.day, part, args.submit, args.validate], args.watch));

withDayAndYear(program.command('add-test'))
  .argument('<part>', 'Defines which part of the solution to run – part 1 or part 2', Number)
  .argument('<answer>', 'Expected answer')
  .argument('[input]', 'Test input')
  .action(async (part, answer, inputArg, { year, day }) => {
    const input = inputArg || await readInput();
    return runCommand('add-test', [year, day, part, input, answer]);
  });

withDayAndYear(program.command('validate'))
  .argument('<part>', 'Defines which part of the solution to run – part 1 or part 2', Number)
  .option('-w, --watch', 'Runs solution in a watch mode. Helpful for development')
  .action((part, { year, day, watch }) => runCommand('validate', [year, day, part], watch));

(async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error(chalk`{red {inverse Error} ${error.message}}`);
    process.exitCode = 1;
  }
}());
