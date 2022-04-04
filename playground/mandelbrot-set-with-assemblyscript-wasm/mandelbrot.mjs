const computeColors = (numColors) => {
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
  return new Uint32Array(context.getImageData(0, 0, numColors, 1).data.buffer);
};

export default class MandelbrotGenerator {
  constructor(canvas, options) {
    const context = canvas.getContext("2d");

    const pixelDensity = window.devicePixelRatio || 1;
    const aspectRatio = 2 / 1;
    const boundingRect = canvas.getBoundingClientRect();
    const width = Math.round(boundingRect.width * pixelDensity);
    const height = Math.round(width / aspectRatio);

    canvas.width = width;
    canvas.height = height;
    context.scale(pixelDensity, pixelDensity);

    this.options = options;
    this.context = context;
    this.width = width;
    this.height = height;
  }

  async init() {
    const { options, context, width, height } = this;
    const { escapeRadius, maxIterations, extraIterations, numColors } = options;

    // Compute the size (in pages) of and instantiate the module's memory.
    // Pages are 64kb. Round up using mask 0xffff before shifting to pages.
    const byteSize = (width * height) << 1; // 2 bytes per pixel
    const memory = new WebAssembly.Memory({
      initial: ((byteSize + 0xffff) & ~0xffff) >>> 16,
    });
    const buffer = new Uint16Array(memory.buffer);
    const imageData = context.createImageData(width, height);
    const argb = new Uint32Array(imageData.data.buffer);

    const imports = { env: { memory }, Math };
    const { instance } = await WebAssembly.instantiateStreaming(fetch("./mandelbrot.release.wasm"), imports);
    const { update } = instance.exports;

    console.time("colors");
    const colors = computeColors(numColors);
    console.timeEnd("colors");
    console.time("mandelbrot");
    update(width, height, escapeRadius, maxIterations, extraIterations, numColors);
    console.timeEnd("mandelbrot");

    // Translate 16-bit color indices to colors.
    for (let y = 0; y < height; ++y) {
      const yx = y * width;
      for (let x = 0; x < width; ++x) {
        argb[yx + x] = colors[buffer[yx + x]];
      }
    }

    context.putImageData(imageData, 0, 0);
  }
}
