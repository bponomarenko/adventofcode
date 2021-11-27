const withFormattedInput = cb => input => cb(+input);

const main = withFormattedInput(input => {
  // Get size of the grid square
  let sideSize = Math.ceil(Math.sqrt(input));
  // Make sure it is odd number
  sideSize = sideSize % 2 === 1 ? sideSize : sideSize + 1;
  // Calculate amount of steps from the center to the outer side
  const distance = (sideSize - 1) / 2;

  let start = (sideSize - 2) ** 2;
  while (start + sideSize - 1 < input) {
    start += sideSize - 1;
  }
  // Calculate amount of steps from the center of the outer side to the number from input
  const travel = Math.abs(start + ((sideSize - 1) / 2) - input);
  // Return total amount of steps
  return distance + travel;
});

module.exports = { main, withFormattedInput };
