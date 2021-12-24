// No parsing – input is manually normalized to a short function
export const formatInput = input => input;

const dx = [15, 11, 10, 12, -11, 11, 14, -6, 10, -6, -6, -16, -4, -2];
const dy = [9, 1, 11, 3, 10, 5, 0, 7, 9, 15, 4, 10, 4, 9];
const dz = [1, 1, 1, 1, 26, 1, 1, 26, 1, 26, 26, 26, 26, 26];

// Manually assembled monad function from the input,  which was possible by analyzing all commands:
// - all input commands are similar and organized in 14 blocks
// - input is only written to the "w" register
// - registers "x" and "y" are initialized with 0 value in the beginning of the block, so only "z" register value is carried over to the next block
// - we can loop over individual blocks of commands instead of running all 14 blocks for every input combination
// - most of the commands are srinked into two functions
//
// All of these optimizations are suppose the make "brute force" approach run faster
const runMonad = (startingZ, i, reverse = false) => {
  // Start from 9 and count down for the first part, so the first found valid number would be the biggest one
  // Do opposite for the part 2
  let input = reverse ? 1 : 9;

  // those doesn't depend on the input – can evaluate them outside of the loop
  const conditionValue = (startingZ % 26) + dx[i];
  const roundedZ = Math.floor(startingZ / dz[i]);

  while (reverse ? input < 10 : input > 0) {
    const x = conditionValue === input ? 0 : 1;
    // For z to be 0, it should either be a positive number (so we have to watch out
    // for the negative numbers in the "dx" array) or second part of equation would be 0 (which would happen when
    // it multiplied by 0 from the "x" register).
    if (dx[i] >= 0 || x === 0) {
      const z = (roundedZ * ((25 * x) + 1) + (input + dy[i]) * x);

      if (i === 13) {
        // Last item – check result
        if (z === 0) {
          return [input];
        }
      } else {
      // Find nested values recursively
        const modelNumber = runMonad(z, i + 1, reverse);
        if (modelNumber) {
        // Assemble full model number
          return [input, ...modelNumber];
        }
      }
    }
    input += reverse ? 1 : -1;
  }
  return null;
};

export const part1 = () => +runMonad(0, 0).join('');

export const part2 = () => +runMonad(0, 0, true).join('');
