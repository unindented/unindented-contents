const sketch = (element) => ($) => {
  const aspectRatio = 4 / 1;
  const size = () => [element.offsetWidth, $.round(element.offsetWidth / aspectRatio)];

  let rainDrops;
  let ui;

  $.setup = () => {
    $.createCanvas(...size());

    rainDrops = RainDrops();

    ui = UI();
    ui.pause();
  };

  $.windowResized = () => {
    const [width, height] = size();

    if (width !== $.width || height !== $.height) {
      $.resizeCanvas(width, height);

      rainDrops.reset();
    }
  };

  $.draw = () => {
    rainDrops.drawAndUpdate();
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

  const RainDrops = () => {
    let drops = [];

    const reset = () => {
      drops.length = 0;

      for (let i = 0, l = $.sqrt($.width * $.height) / 6; i < l; i++) {
        drops.push(Drop());
      }

      $.textAlign($.CENTER, $.CENTER);
      $.textStyle($.BOLD);
      $.noFill();
    };

    const drawAndUpdate = () => {
      $.clear();

      drops.forEach((d) => {
        d.drawAndUpdate();
      });
    };

    reset();

    return { reset, drawAndUpdate };
  };

  const Drop = () => {
    const MIN_SIZE = 10;
    const MAX_SIZE = 50;
    const GROWTH = 0.25;

    let x;
    let y;
    let size;
    let maxSize;

    const reset = () => {
      x = $.random() * ($.width - MAX_SIZE) + MAX_SIZE / 2;
      y = $.random() * ($.height - MAX_SIZE) + MAX_SIZE / 2;
      size = ($.random() * MAX_SIZE) / 4 + MIN_SIZE;
      maxSize = size * 2;
    };

    const drawAndUpdate = () => {
      draw();
      update();
    };

    const draw = () => {
      const alpha = 64 - 64 * $.pow(size / maxSize, 6);
      $.stroke(255, 255, 255, alpha);
      $.textSize(size);
      $.text("404", x, y);
    };

    const update = () => {
      if (size < maxSize) {
        size += GROWTH;
      } else {
        reset();
      }
    };

    reset();

    return { reset, drawAndUpdate };
  };
};

export default (element) => new p5(sketch(element), element);
