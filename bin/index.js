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
  if (watch) {
    return new Promise(resolve => {
      const nodemonConfig = {
        script: 'bin/index.js',
        args: [name].concat(args).concat('--no-watch'),
        ext: 'js,json',
        ignore: ['invalid-answers.json'],
      };

      nodemon(nodemonConfig)
        .once('start', () => {
          console.log(chalk.gray.dim('Starting in the watch mode'));
        })
        .on('restart', () => {
          console.clear();
          console.log(chalk.gray.dim('Restarted'));
        })
        .on('message', message => {
          if (message === 'switch') {
            console.log(chalk.gray.dim('Switching to the part 2'));

            // Update nodemon config
            nodemon.config.load({
              ...nodemonConfig,
              // Part is always the last argument, which should be replaced with part2!
              args: [name].concat(args.slice(0, -1)).concat(2, '--no-watch'),
            }, () => {});
            nodemon.restart();
          } else if (message === 'exit') {
            nodemon.emit('quit');
            nodemon.reset();
          }
        })
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
  .argument('[part]', 'Defines which part of the solution to run – part 1 or part 2', Number, 1)
  .description('Runs puzzle solution code with specified input and prints the answer')
  .option('--no-submit', 'Do not ask to submit found answer')
  .option('--no-init', 'Do not scaffold the solution before')
  .option('--no-watch', 'Do not run solution in a watch mode')
  .option('--no-validate', 'Do not run validation test cases prior to solving a solution')
  .action(async (part, args) => {
    if (args.init && args.watch) {
      // Initialize the project first
      await runCommand('init', [args.year, args.day]);
    }
    const cmdArgs = args.watch
      ? ['-y', args.year, '-d', args.day, args.submit ? null : '--no-submit', args.validate ? null : '--no-validate', part]
      : [args.year, args.day, part, args.submit, args.validate];
    // Try to solve it now
    const result = await runCommand('solve', cmdArgs.filter(value => value !== null), args.watch);

    if (result?.success && !args.watch) {
      // This means we just solved part 1, and need to re-start watch server with part 2
      process.send(part === 1 ? 'switch' : 'exit');
    }
  });

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
  .option('--no-watch', 'Do not run solution in a watch mode')
  .action((part, { year, day, watch }) => {
    const args = watch ? ['-y', year, '-d', day, part] : [year, day, part];
    return runCommand('validate', args, watch);
  });

withDayAndYear(program.command('easter-eggs'))
  .description('Tries to find easter-eggs on the puzzle page (words with additional info on them), and prints links to them')
  .action(({ year, day }) => runCommand('easter-eggs', [year, day]));

(async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error(chalk`{red {inverse Error} ${error.message}}`);
    process.exitCode = 1;
  }
}());
