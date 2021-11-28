const withFormattedInput = cb => input => cb(+input);

const getSquareSize = input => {
  // Get size of the grid square
  const sideSize = Math.ceil(Math.sqrt(input));
  // Make sure it is odd number
  return sideSize % 2 === 1 ? sideSize : sideSize + 1;
};

const main = withFormattedInput(input => {
  const sideSize = getSquareSize(input);
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

module.exports = { main, withFormattedInput, getSquareSize };
