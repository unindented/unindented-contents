const defaults = {
  width: 640,
  height: 480,
  rows: 10,
  cols: 20,

  incRadius: 5,
  decRadius: 0.25,

  idleDuration: 5000,
  idlePeriod: 100,

  colors: ["#333", "#666", "#999"],
};

const slice = Array.prototype.slice;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const clone = (arr) => slice.call(arr, 0);

export default class TouchGrid {
  constructor(canvas, options) {
    this.onResize = this.onResize.bind(this);
    this.onMove = this.onMove.bind(this);

    this.initOptions(Object.assign({}, defaults, options));
    this.initCanvas(canvas);
    this.initCircles();

    window.addEventListener("resize", this.onResize, { passive: true });
    this.canvas.addEventListener("mousemove", this.onMove, { capture: true, passive: true });
    this.canvas.addEventListener("touchmove", this.onMove, { capture: true, passive: true });

    this.animate();
  }

  animate() {
    const step = () => {
      this.clearCanvas();
      this.drawCircles();
      this.decreaseCircles();

      window.requestAnimationFrame(step);
    };

    step();

    this.resetIdleTimeout();
  }

  initOptions(options) {
    this.width = options.width;
    this.height = options.height;
    this.rows = options.rows;
    this.cols = options.cols;
    this.incRadius = options.incRadius;
    this.decRadius = options.decRadius;
    this.idleDuration = options.idleDuration;
    this.idlePeriod = options.idlePeriod;
    this.colors = options.colors;

    this.maxRadius = Math.min(this.width / this.cols, this.height / this.rows) / 1.75;
    this.minRadius = this.maxRadius / 4;
    this.margin = this.maxRadius / 3;

    this.cellWidth = (this.width - this.margin * 2) / this.cols;
    this.cellHeight = (this.height - this.margin * 2) / this.rows;
    this.marginWidth = this.cellWidth / 2 + this.margin;
    this.marginHeight = this.cellHeight / 2 + this.margin;
  }

  initCanvas(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    this.ratio = window.devicePixelRatio || 1;

    this.canvas.width = this.width * this.ratio;
    this.canvas.height = this.height * this.ratio;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "auto";
    this.canvas.style.cursor = "crosshair";
    this.canvas.style.touchAction = "none";

    this.context.scale(this.ratio, this.ratio);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  position(coords, value) {
    const pos = coords.row * this.cols + coords.col;

    if (typeof value === "undefined") {
      return this.circles[pos];
    }
    this.circles[pos] = value;
  }

  coordinates() {
    const coords = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        coords.push({ row, col });
      }
    }

    return coords;
  }

  unsortedCircles() {
    return this.circles;
  }

  sortedCircles() {
    return clone(this.circles).sort((circle1, circle2) => circle1.r > circle2.r);
  }

  initCircles() {
    this.circles = [];

    this.coordinates().forEach((coords) => {
      this.position(coords, this.initCircle(coords));
    });
  }

  initCircle(coords) {
    return {
      x: coords.col * this.cellWidth + this.marginWidth,
      y: coords.row * this.cellHeight + this.marginHeight,
      radius: this.minRadius,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    };
  }

  drawCircles() {
    this.sortedCircles().forEach((circle) => {
      this.drawCircle(circle);
      this.decreaseCircle(circle);
    });
  }

  drawCircle(circle) {
    const context = this.context;

    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
    context.fillStyle = circle.color;
    context.fill();
  }

  decreaseCircles() {
    this.unsortedCircles().forEach(this.decreaseCircle, this);
  }

  decreaseCircle(circle) {
    if (circle.radius > this.minRadius) {
      circle.radius = clamp(circle.radius, this.minRadius, circle.radius - this.decRadius);
    }
  }

  increaseCircles() {
    this.unsortedCircles().forEach(this.increaseCircle, this);
  }

  increaseCircle(circle) {
    if (circle.radius < this.maxRadius) {
      circle.radius = clamp(circle.radius, circle.radius + this.incRadius, this.maxRadius);
    }
  }

  maximizeCircles() {
    this.unsortedCircles().forEach(this.maximizeCircle, this);
  }

  maximizeCircle(circle) {
    circle.radius = this.maxRadius;
  }

  runIdleAnimation(index) {
    const circles = this.unsortedCircles();
    const circle = circles[index];
    this.maximizeCircle(circle);

    const next = (index + 1) % circles.length;
    this.idleTimeout = setTimeout(this.runIdleAnimation.bind(this, next), this.idlePeriod);
  }

  resetIdleTimeout() {
    clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(this.runIdleAnimation.bind(this, 0), this.idleDuration);
  }

  onResize() {
    this.realWidth = this.realHeight = null;
  }

  onMove(evt) {
    if (this.realWidth == null || this.realHeight == null) {
      this.calculateDimensions();
    }

    this.eventTouches(evt).forEach((touch) => {
      const coords = this.eventCoords(touch);
      const circle = this.position(coords);
      this.increaseCircle(circle);
    });

    this.resetIdleTimeout();
  }

  eventCoords(evt) {
    let x = ((evt.pageX - this.offsetLeft) * this.width) / this.realWidth;
    let y = ((evt.pageY - this.offsetTop) * this.height) / this.realHeight;
    x = clamp(x, 0, this.width - 1);
    y = clamp(y, 0, this.height - 1);

    let row = Math.round((y - this.marginHeight) / this.cellHeight);
    let col = Math.round((x - this.marginWidth) / this.cellWidth);
    row = clamp(row, 0, this.rows - 1);
    col = clamp(col, 0, this.cols - 1);

    return { row, col };
  }

  eventTouches(evt) {
    return evt.touches != null ? clone(evt.touches) : [evt];
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
