// @ts-check

const rows = 32;
const cols = 64;

export default class Display {
  constructor() {
    /** @type {Uint8Array} */
    this.display = new Uint8Array(rows * cols);

    /** @type {HTMLCanvasElement | null} */
    this.canvas = null;
    /** @type {CanvasRenderingContext2D | null} */
    this.context = null;

    /** @type {number} */
    this.width = 0;
    /** @type {number} */
    this.height = 0;
  }

  /**
   * @param {HTMLCanvasElement | null | undefined} canvas
   */
  setCanvas(canvas) {
    const context = canvas?.getContext("2d") ?? null;

    if (canvas == null || context == null) {
      return;
    }

    const pixelDensity = window.devicePixelRatio;
    const boundingRect = canvas.getBoundingClientRect();
    const width = boundingRect.width;
    const height = boundingRect.height;

    canvas.width = width * pixelDensity;
    canvas.height = height * pixelDensity;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.scale(pixelDensity, pixelDensity);
    context.fillStyle = "#000";

    this.context = context;
    this.width = width;
    this.height = height;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  togglePixel(x, y) {
    const index = x + y * cols;
    this.display[index] ^= 1;

    return !this.display[index];
  }

  clear() {
    this.display = new Uint8Array(rows * cols);
  }

  render() {
    if (this.context == null) {
      return;
    }

    const { width, height } = this;
    const rx = width / cols;
    const ry = height / rows;

    this.context.clearRect(0, 0, width, height);

    for (let i = 0, l = rows * cols; i < l; i++) {
      const x = (i % cols) * rx;
      const y = Math.floor(i / cols) * ry;

      if (this.display[i]) {
        this.context.fillRect(x, y, rx, ry);
      }
    }
  }
}
