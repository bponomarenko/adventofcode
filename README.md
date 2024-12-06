## Advent of Code solutions

![](https://img.shields.io/badge/stars%20⭐-449%2F500-brightgreen)
[![](https://badgen.net/badge/icon/Open%20in%20codespaces?icon=github&label)](https://codespaces.new/bponomarenko/adventofcode?quickstart=1)

Small project to keep all my solutions for the Advent of Code[^aoc] puzzles and automation tools to solve them.

Automation framework consists of CLI with the following commands:

* 🏗 `aoc init` scaffolds files with boilerplate code for your solution, as well as downloads puzzle input from the AOC website
* 💡 `aoc solve` executes your solution and displays the result. It also supports the following sub-commands in the watch mode:
  * press `s` to submit the answer
  * press `r` to re-run current solution
  * press `c` to toggle between part 1 and part 2
* 💾 `aoc test` adds test case to validate solution against
* 🔌 `aoc validate` validates current solution against all configured test cases
* 🎁 `aoc easter-egg` would generate a link to the hidden text on the page (link would only work in the [Google Chrome v90+](https://blog.google/products/chrome/more-helpful-chrome-throughout-your-workday/))

You can check all possible options and configurations for the `aoc` CLI by running `aoc -h`.

### Setup

1. Run `npm install` to install project dependencies.
1. Run `npm link` to add project's bin folder to your user's path, so that you can run CLI by `aoc` name from terminal. Alternatively you'll be able to use CLI by running `node ./bin/index.js ...`.
1. Configure AOC website session cookie (see Configuration section below).

### Configuration

This project requires `.env` file in the root folder with the session cookie: `SESSION_COOKIE=....` to connect to the AOC website (for pulling the input data and submitting the answer). Alternatively you can set `LEADERBOARD_ID=...` with your private leaderboard ID to get information on how many people solved the puzzle.

#### GitHub Codespaces

You can [easily start a new dev container](https://codespaces.new/bponomarenko/adventofcode) for this repository (or for your clonned repository) which will have all necessary configurations to run puzzle solutions upon launching. For GituHb Codespaces, aternatively to `.env` file, you can manage your session cookie value in the [Codespaces secrets][secrets]. You will be asked to fill it in upon creating a new codespace or you can do it manually by creating a new secret with the name `AOC_SESSION_ID` and session cookie from AOC website as a value. In case of manual creation you would also need to associate this secret with the codespace repository.

### Extensions

A lot of puzzle solutions does rely on the extended native objects – for example, `Array.prototype.sum()`. Usually it is not recommended to do this, but in this project it helps to eliminate writing additional import statements for competetive programming.
See full list of the extended prototype methods in the `/lib/prototype-extensions.js` file.

[^aoc]:
    [Advent of Code][aoc] – an annual event of Christmas-oriented programming challenges started December 2015.
    Every year since then, beginning on the first day of December, a programming puzzle is published every day for twenty-five days.
    You can solve the puzzle and provide an answer using the language of your choice.

[aoc]: https://adventofcode.com
[secrets]: https://docs.github.com/en/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces
