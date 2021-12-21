export const formatInput = input => input.split('\n').map(line => +line.split(':')[1]);

export const part1 = positions => {
  const scores = [0, 0];
  let dice = 0;
  let player = 0; // 0 is first player, 1 is second

  const rollDice = () => {
    dice = dice === 1000 ? 1 : dice + 1;
    return dice;
  };

  while (scores.every(score => score < 1000)) {
    let steps = 0;

    // Roll the dice
    for (let i = 0; i < 3; i += 1) {
      steps += rollDice();
    }

    // Update player position
    positions[player] = (positions[player] + steps) % 10;
    // Update player score
    scores[player] += positions[player] > 0 ? positions[player] : 10;
    // Move turn to other player
    player = player ? 0 : 1;
  }

  return Math.min(...scores) * dice;
};

// After 3 rolls there would be 27 variatoins but with similar results
// This array contains variations with count of times the same it would result with the same value
const diceRolls = [[3, 1], [4, 3], [5, 6], [6, 7], [7, 6], [8, 3], [9, 1]];

export const part2 = ([p1, p2]) => {
  // Queue of all possible game variations
  const queue = [{
    p1, p2, s1: 0, s2: 0, firstPlayer: true, count: 1,
  }];
  let winCounts = [0, 0];

  while (queue.length) {
    const state = queue.pop();

    diceRolls.forEach(([steps, count]) => {
      const newState = { ...state, count: state.count * count };

      if (newState.firstPlayer) {
        newState.p1 = (newState.p1 + steps) % 10;
        newState.s1 += newState.p1 > 0 ? newState.p1 : 10;
      } else {
        newState.p2 = (newState.p2 + steps) % 10;
        newState.s2 += newState.p2 > 0 ? newState.p2 : 10;
      }
      newState.firstPlayer = !newState.firstPlayer;

      // If game ends – count the wins, if not – add state to the queue
      if (newState.s1 >= 21 || newState.s2 >= 21) {
        winCounts[newState.s1 > newState.s2 ? 0 : 1] += newState.count;
      } else {
        queue.push(newState);
      }
    });
  }
  return Math.max(...winCounts);
};
