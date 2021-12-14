## Advent of Code solutions

![](https://img.shields.io/badge/stars%20⭐-234%2F350-brightgreen)

Small project to keep all found solutions for the [Advent of Code](https://adventofcode.com/) puzzles.

It also contains CLI with automation commands:

* 🏗 `npx aoc init` scaffolds files with code for solution and puzzle input for today'z puzzle
* 💡 `npx aoc solve` executes the solution and can optionally submit the answer
* 💾 `npx aoc test` adds test case to validate solution against
* 🔌 `npx aoc validate` validates current solution against all configured test cases
* 🎁 `npx aoc easter-egg` would generate a link to the hidden text on the page (link would only work in the [Google Chrome v90+](https://blog.google/products/chrome/more-helpful-chrome-throughout-your-workday/))

(it requires `.env` file in the root folder with the session cookie: `SESSION_COOKIE=....` to connect to the aoc website)
