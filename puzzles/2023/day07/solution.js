import { sum } from '../../utils/collections.js';

export const formatInput = input => input.split('\n').map(line => {
  const [hand, bid] = line.split(' ');
  return [hand, +bid];
});

const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const types = ['five', 'four', 'fullHouse', 'three', 'twoPairs', 'pair', 'high'];
const joker = 'J';

const getType = (str, withJoker) => {
  if (withJoker && str.includes(joker)) {
    let bestIndex = Infinity;
    cards.forEach(card => {
      if (card === joker) {
        return;
      }
      const typeIndex = types.indexOf(getType(str.replace(joker, card), true));
      if (typeIndex < bestIndex) {
        bestIndex = typeIndex;
      }
    });
    return types[bestIndex];
  }

  let type;
  let size = str.length;
  while (size > 0) {
    str = str.replaceAll(str[0], '');
    const newSize = str.length;
    switch (size - newSize) {
      case 5:
        return 'five';
      case 4:
        return 'four';
      case 3:
        if (type === 'pair') {
          return 'fullHouse';
        }
        type = 'three';
        break;
      case 2:
        if (type === 'three') {
          return 'fullHouse';
        }
        if (type === 'pair') {
          return 'twoPairs';
        }
        type = 'pair';
        break;
      default:
        type = type || 'high';
        break;
    }
    size = newSize;
  }
  return type;
};

const cardsCount = cards.length;
const getCardIndex = (card, withJoker) => (withJoker && card === joker ? cardsCount : cards.indexOf(card));

const sortHands = withJoker => ([hand1, type1], [hand2, type2]) => {
  if (type1 === type2) {
    let sortResult = 0;
    let index = 0;
    while (sortResult === 0 && index < 5) {
      sortResult = getCardIndex(hand1[index], withJoker) - getCardIndex(hand2[index], withJoker);
      index += 1;
    }
    return sortResult;
  }
  return types.indexOf(type1) - types.indexOf(type2);
};

const getSortedBids = (input, withJoker) => input
  .map(([hand, bid]) => [hand, getType(hand, withJoker), bid])
  .sort(sortHands(withJoker))
  .reverse()
  .map(([, , bid], index) => bid * (index + 1));

export const part1 = input => sum(getSortedBids(input));

export const part2 = input => sum(getSortedBids(input, true));
