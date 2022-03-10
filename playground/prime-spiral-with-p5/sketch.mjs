const sieve = (n) => {
  const primes = Array(n + 1).fill(true);

  primes[0] = false;
  primes[1] = false;

  for (let i = 2; i <= Math.sqrt(n); i += 1) {
    if (primes[i]) {
      for (let j = i * i; j <= n; j += i) {
        primes[j] = false;
      }
    }
  }

  return primes;
};

const sketch = (element, options) => ($) => {
  const aspectRatio = 1 / 1;
  const size = () => [element.offsetWidth, $.round(element.offsetWidth / aspectRatio)];

  let primeSpiral;
  let ui;

  $.setup = () => {
    $.createCanvas(...size());

    primeSpiral = PrimeSpiral(options);

    ui = UI();
    ui.pause();
  };

  $.windowResized = () => {
    const [width, height] = size();

    if (width !== $.width || height !== $.height) {
      $.resizeCanvas(width, height);

      primeSpiral.reset();
    }
  };

  $.draw = () => {
    primeSpiral.drawAndUpdate();
  };

  const UI = () => {
    const playButton = $.select('[data-action="play"]', element);
    const pauseButton = $.select('[data-action="pause"]', element);
    const downloadButton = $.select('[data-action="download"]', element);

    const play = () => {
      playButton?.addClass("hidden");
      pauseButton?.removeClass("hidden");
      $.loop();
    };

    const pause = () => {
      playButton?.removeClass("hidden");
      pauseButton?.addClass("hidden");
      $.noLoop();
    };

    const download = () => {
      $.saveCanvas(element.id, "png");
    };

    playButton?.mouseClicked(play);
    pauseButton?.mouseClicked(pause);
    downloadButton?.mouseClicked(download);

    return { play, pause, download };
  };

  const PrimeSpiral = (options) => {
    const DIRECTION_RIGHT = 0;
    const DIRECTION_UP = 1;
    const DIRECTION_LEFT = 2;
    const DIRECTION_DOWN = 3;

    const size = options.size ?? 201;
    const showNumbers = options.showNumbers ?? false;
    const primes = sieve(size * size);

    let shouldReset;
    let step;
    let stepSize;
    let direction;
    let x;
    let y;

    const reset = () => {
      shouldReset = false;

      step = 1;
      stepSize = $.width / size;
      direction = DIRECTION_RIGHT;

      x = $.width / 2;
      y = $.width / 2;

      $.noStroke();
      $.rectMode($.CENTER);
      $.textAlign($.CENTER, $.CENTER);
      $.textSize(stepSize * 0.4);
      $.clear();
    };

    const drawAndUpdate = () => {
      if (shouldReset) {
        reset();
      }

      draw();
      update();
    };

    const draw = () => {
      const rectColor = primes[step] ? 255 : 64;
      $.fill(rectColor);
      $.circle(x, y, stepSize);

      if (showNumbers) {
        const textColor = primes[step] ? 64 : 128;
        $.fill(textColor);
        $.text(step, x, y);
      }
    };

    const update = () => {
      switch (direction) {
        case DIRECTION_RIGHT:
          x += stepSize;
          break;
        case DIRECTION_DOWN:
          y += stepSize;
          break;
        case DIRECTION_LEFT:
          x -= stepSize;
          break;
        case DIRECTION_UP:
          y -= stepSize;
          break;
      }

      const stepsInRow = $.ceil($.sqrt(step));
      if (step % stepsInRow === 0) {
        direction = (direction + 1) % 4;
      }

      if (step < primes.length) {
        step++;
      } else {
        shouldReset = true;
        ui.pause();
      }
    };

    reset();

    return { reset, drawAndUpdate };
  };
};

export default (element, options) => new p5(sketch(element, options), element);
