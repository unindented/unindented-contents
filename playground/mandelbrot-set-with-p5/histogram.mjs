const createColorPalette = (numColors) => {
  const canvas = document.createElement("canvas");
  canvas.width = numColors;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, numColors, 0);
  gradient.addColorStop(0.0, "rgb(0, 7, 100)");
  gradient.addColorStop(0.16, "rgb(32, 107, 203)");
  gradient.addColorStop(0.42, "rgb(237, 255, 255)");
  gradient.addColorStop(0.6425, "rgb(255, 170, 0)");
  gradient.addColorStop(0.8575, "rgb(0, 2, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, numColors, 1);
  return context.getImageData(0, 0, numColors, 1).data;
};

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
    console.time("histogram");
    mandelbrot.draw();
    console.timeEnd("histogram");
  };

  const Mandelbrot = (options) => {
    const { escapeRadius, maxIterations, numColors } = options;
    const escapeRadius2 = escapeRadius * escapeRadius;

    const colorPalette = createColorPalette(numColors);

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

          const colorIndex = Math.round($.map(iteration, 0, maxIterations, 0, numColors - 1));
          const [r, g, b, a] = colorPalette.slice(colorIndex * 4, (colorIndex + 1) * 4);

          const pixel = yOffset + xOffset;
          $.pixels[pixel + 0] = r;
          $.pixels[pixel + 1] = g;
          $.pixels[pixel + 2] = b;
          $.pixels[pixel + 3] = a;
        }
      }
    };

    reset();

    return { reset, draw };
  };
};

export default (element, options) => new p5(sketch(element, options), element);
