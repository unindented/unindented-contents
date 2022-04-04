const sketch = (element, options) => ($) => {
  const aspectRatio = 2 / 1;
  const size = () => [Math.round(element.offsetWidth), Math.round(element.offsetWidth / aspectRatio)];

  let mandelbrot;

  $.setup = () => {
    $.createCanvas(...size());

    mandelbrot = Mandelbrot(options);

    $.noLoop();
  };

  $.windowResized = () => {
    const [width, height] = size();

    if (width !== width || height !== height) {
      $.resizeCanvas(width, height);

      mandelbrot.reset();
    }
  };

  $.draw = () => {
    console.time("grayscale");
    mandelbrot.draw();
    console.timeEnd("grayscale");
  };

  const Mandelbrot = (options) => {
    const { escapeRadius, maxIterations } = options;
    const escapeRadius2 = escapeRadius * escapeRadius;

    const reset = () => {
      $.clear();
    };

    const draw = () => {
      $.loadPixels();

      const width = $.width * $.pixelDensity();
      const height = $.height * $.pixelDensity();

      update(width, height);

      $.updatePixels();
    };

    const update = (width, height) => {
      const translateX = width * (1 / 1.6);
      const translateY = height * (1 / 2);
      const scale = 10 / Math.min(3 * width, 4 * height);
      const realOffset = translateX * scale;

      for (let py = 0; py < height; py++) {
        const y0 = (py - translateY) * scale;
        const yOffset = py * width * 4;

        for (let px = 0; px < width; px++) {
          const x0 = px * scale - realOffset;
          const xOffset = px * 4;

          let x = 0;
          let y = 0;
          let x2 = 0;
          let y2 = 0;
          let iteration = 0;

          // Iterate until either the escape radius or max iteration is exceeded.
          while (x2 + y2 <= escapeRadius2) {
            x2 = x * x;
            y2 = y * y;
            y = 2 * x * y + y0;
            x = x2 - y2 + x0;
            if (iteration >= maxIterations) {
              break;
            }
            iteration++;
          }

          const brightness = iteration >= maxIterations ? 0 : Math.round($.map(iteration, 0, maxIterations, 0, 255));

          const pixel = yOffset + xOffset;
          $.pixels[pixel + 0] = brightness;
          $.pixels[pixel + 1] = brightness;
          $.pixels[pixel + 2] = brightness;
          $.pixels[pixel + 3] = 255;
        }
      }
    };

    reset();

    return { reset, draw };
  };
};

export default (element, options) => new p5(sketch(element, options), element);
