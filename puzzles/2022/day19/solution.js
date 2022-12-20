export const formatInput = input => input.split('\n').map(line => {
  const digits = line.match(/\d+/g);
  return {
    id: +digits[0],
    costs: [
      [+digits[1], 0, 0, 0],
      [+digits[2], 0, 0, 0],
      [+digits[3], +digits[4], 0, 0],
      [+digits[5], 0, +digits[6], 0],
    ],
  };
});

const canBuildRobot = (resources, costs) => costs.every((cost, i) => cost <= resources[i]);
const getProjectedMaxGeode = (time, resources) => resources + (time * (time + 1)) / 2;

const findMaxGeode = (costs, startTime) => {
  const maxRobots = costs[0].map((_, i) => Math.max(...costs.map(cost => cost[i])));
  let maxGeode = 0;

  const openGeodes = (time, robots, resources) => {
    if (time <= 0 || getProjectedMaxGeode(time, resources[3]) < maxGeode) {
      return;
    }
    maxGeode = Math.max(maxGeode, resources[3]);

    for (let i = 3; i >= 0; i -= 1) {
      if (i > 1 ? robots[i - 1] === 0 : robots[i] >= maxRobots[i]) {
        continue;
      }

      let canBuild = canBuildRobot(resources, costs[i]);
      let timeAdv = 1;
      if (!canBuild) {
        timeAdv += Math.max(...costs[i].map((cost, j) => (cost > 0 ? Math.ceil((cost - resources[j]) / robots[j]) : -Infinity)));
      }

      if (i < 3 && time - timeAdv <= 4 - i) {
        continue;
      }

      openGeodes(
        time - timeAdv,
        robots.map((value, j) => value + (i === j)),
        resources.map((value, j) => {
          if (j === 3) {
            return i === 3 ? value + time - timeAdv : value;
          }
          return value + timeAdv * robots[j] - costs[i][j];
        }),
      );

      if (i === 3 && canBuild) {
        return;
      }
    }
  };

  openGeodes(startTime, [1, 0, 0, 0], [0, 0, 0, 0]);
  return maxGeode;
};

export const part1 = input => input.reduce((sum, { id, costs }) => sum + id * findMaxGeode(costs, 24), 0);

export const part2 = input => input.slice(0, 3).reduce((acc, { costs }) => acc * findMaxGeode(costs, 32), 1);
