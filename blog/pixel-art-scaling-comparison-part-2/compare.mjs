const defaults = {
  color: "#333",
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export default class ImageCompare {
  constructor(canvas, options) {
    this.onResize = this.onResize.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onLoad = this.onLoad.bind(this);

    this.initOptions(Object.assign({}, defaults, options));
    this.initCanvas(canvas);

    window.addEventListener("resize", this.onResize, { passive: true });
    this.canvas.addEventListener("mousemove", this.onMove, { capture: true, passive: true });
    this.canvas.addEventListener("touchmove", this.onMove, { capture: true, passive: true });

    this.start();
  }

  initOptions(options) {
    this.path1 = options.path1;
    this.path2 = options.path2;
    this.color = options.color;
  }

  initCanvas(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    this.canvas.style.cursor = "crosshair";
    this.canvas.style.touchAction = "none";
  }

  setSource1(src) {
    this.image1.src = src;
  }

  setSource2(src) {
    this.image2.src = src;
  }

  resetSizes() {
    this.realWidth = this.realHeight = null;
  }

  start() {
    this.image1 = new Image();
    this.image1.addEventListener("load", this.onLoad);

    this.image2 = new Image();
    this.image2.addEventListener("load", this.onLoad);

    this.setSource1(this.path1);
    this.setSource2(this.path2);
  }

  onResize() {
    this.resetSizes();
  }

  onLoad() {
    if (this.image1.width !== this.image2.width || this.image1.height !== this.image2.height) {
      console.warn("Images have different sizes");
      return;
    }

    this.width = this.canvas.width = this.image1.width;
    this.height = this.canvas.height = this.image1.height;

    this.resetSizes();
    this.drawImages();
    this.drawSplit();
  }

  onMove(evt) {
    if (this.realWidth == null || this.realHeight == null) {
      this.calculateDimensions();
    }

    const coords = this.eventCoords(this.eventTouch(evt));

    this.drawSplit(coords.x);
  }

  drawImages() {
    const half = this.width / 2;

    this.drawImage(this.image1, 0, half);

    this.drawImage(this.image2, half, half);
  }

  drawImage(image, x, width) {
    const y = 0;
    const height = this.height;

    this.context.drawImage(image, x, y, width, height, x, y, width, height);
  }

  drawSplit(x) {
    if (x == null) {
      x = this.width / 2;
    }

    this.drawDifference(x);
    this.strokeLine(x);
  }

  drawDifference(x) {
    if (x > this.lastX) {
      this.drawImage(this.image1, this.lastX - 1, x - this.lastX + 2);
    } else if (x < this.lastX) {
      this.drawImage(this.image2, x - 1, this.lastX - x + 2);
    }
    this.lastX = x;
  }

  strokeLine(x) {
    const context = this.context;

    context.lineWidth = 1;
    context.strokeStyle = this.color;

    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, this.height);
    context.stroke();
  }

  eventCoords(evt) {
    let x = ((evt.pageX - this.offsetLeft) * this.width) / this.realWidth;
    let y = ((evt.pageY - this.offsetTop) * this.height) / this.realHeight;
    x = clamp(x, 0, this.width - 1);
    y = clamp(y, 0, this.height - 1);

    return { x, y };
  }

  eventTouch(evt) {
    return evt.touches != null ? evt.touches[0] : evt;
  }

  calculateDimensions() {
    const styles = window.getComputedStyle(this.canvas, null);
    const rect = this.canvas.getBoundingClientRect();

    const offsetLeft = rect.left + window.pageXOffset;
    const offsetTop = rect.top + window.pageYOffset;
    const paddingLeft = parseInt(styles.paddingLeft, 10) || 0;
    const paddingTop = parseInt(styles.paddingTop, 10) || 0;
    const borderLeft = parseInt(styles.borderLeftWidth, 10) || 0;
    const borderTop = parseInt(styles.borderTopWidth, 10) || 0;

    this.realWidth = rect.width - 2 * paddingLeft - 2 * borderLeft;
    this.realHeight = rect.height - 2 * paddingTop - 2 * borderTop;
    this.offsetLeft = offsetLeft + paddingLeft + borderLeft;
    this.offsetTop = offsetTop + paddingTop + borderTop;
  }
}
