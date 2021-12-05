const re = /^.*\s(?<speed>\d+).*\s(?<duration>\d+).*\s(?<cooldown>\d+)/;

export const formatInput = input => input.split('\n').map(str => {
  const values = re.exec(str).groups;
  return {
    speed: +values.speed,
    duration: +values.duration,
    cooldown: +values.cooldown,
    total: 0,
    running: true,
    breakpoint: +values.duration,
    score: 0,
  };
});

const seconds = 2503;

export const part1 = racers => {
  for (let sec = 0; sec < seconds; sec += 1) {
    racers.forEach(racer => {
      if (sec >= racer.breakpoint) {
        racer.running = !racer.running;
        racer.breakpoint = sec + (racer.running ? racer.duration : racer.cooldown);
      }

      if (racer.running) {
        racer.total += racer.speed;
      }
    });
  }
  return Math.max(...racers.map(({ total }) => total));
};

export const part2 = racers => {
  for (let sec = 0; sec < seconds; sec += 1) {
    racers.forEach(racer => {
      if (sec >= racer.breakpoint) {
        racer.running = !racer.running;
        racer.breakpoint = sec + (racer.running ? racer.duration : racer.cooldown);
      }

      if (racer.running) {
        racer.total += racer.speed;
      }
    });

    const totalScore = Math.max(...racers.map(({ total }) => total));
    racers.forEach(racer => {
      if (racer.total === totalScore) {
        racer.score += 1;
      }
    });
  }
  return Math.max(...racers.map(({ score }) => score));
};
