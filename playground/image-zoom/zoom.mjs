const defaults = {
  zoomWidth: 180,
  zoomHeight: 180,
  zoomLevel: 4,

  color: "#333",
  editable: false,
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export default class ImageZoom {
  constructor(canvas, options) {
    this.onResize = this.onResize.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onRead = this.onRead.bind(this);

    this.initOptions(Object.assign({}, defaults, options));
    this.initCanvas(canvas);

    window.addEventListener("resize", this.onResize, { passive: true });
    this.canvas.addEventListener("mousemove", this.onMove, { capture: true, passive: true });
    this.canvas.addEventListener("touchmove", this.onMove, { capture: true, passive: true });
    if (this.editable) {
      this.canvas.addEventListener("dragenter", this.onDragEnter, { capture: true });
      this.canvas.addEventListener("dragleave", this.onDragLeave, { capture: true });
      this.canvas.addEventListener("dragover", this.onDragOver, { capture: true });
      this.canvas.addEventListener("drop", this.onDrop, { capture: true });
    }

    this.start();
  }

  initOptions(options) {
    this.path = options.path;
    this.zoomWidth = options.zoomWidth;
    this.zoomHeight = options.zoomHeight;
    this.zoomLevel = options.zoomLevel;
    this.color = options.color;
    this.editable = options.editable;
  }

  initCanvas(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    this.canvas.style.cursor = "crosshair";
    this.canvas.style.touchAction = "none";
  }

  setSource(src) {
    this.image.src = src;
  }

  setZoomLevel(zoomLevel) {
    this.zoomLevel = zoomLevel;

    this.eraseMagnifyingGlass();
    this.drawMagnifyingGlass(this.width / 2, this.height / 2);
  }

  resetSizes() {
    this.realWidth = this.realHeight = null;
  }

  start() {
    this.image = new Image();
    this.image.addEventListener("load", this.onLoad);

    this.reader = new FileReader();
    this.reader.addEventListener("load", this.onRead);

    this.setSource(this.path);
  }

  onResize() {
    this.resetSizes();
  }

  onLoad() {
    this.width = this.canvas.width = this.image.width;
    this.height = this.canvas.height = this.image.height;

    this.resetSizes();
    this.drawImage();
    this.setZoomLevel(this.zoomLevel);
  }

  onMove(evt) {
    if (this.realWidth == null || this.realHeight == null) {
      this.calculateDimensions();
    }

    const coords = this.eventCoords(this.eventTouch(evt));

    this.eraseMagnifyingGlass();
    this.drawMagnifyingGlass(coords.x, coords.y);
  }

  onDragEnter() {
    // Give visual feedback that the drag is working.
    this.canvas.style.opacity = 0.5;
  }

  onDragLeave() {
    // Remove visual feedback.
    this.canvas.style.opacity = 1.0;
  }

  onDragOver(evt) {
    if (this.eventContainsFile(evt)) {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "link";
    }
  }

  onDrop(evt) {
    evt.preventDefault();

    const img = this.eventImage(evt);
    if (img != null) {
      this.reader.readAsDataURL(img);
    }

    // Remove visual feedback.
    this.canvas.style.opacity = 1.0;
  }

  onRead(evt) {
    this.setSource(evt.target.result);
  }

  drawImage() {
    this.clipData = null;

    this.context.drawImage(this.image, 0, 0, this.width, this.height);
  }

  drawMagnifyingGlass(x, y) {
    this.saveData(x, y);

    this.context.save();

    this.clipRectangle(this.bigRect);
    this.drawZoomedImage();
    // this.strokeRectangle(this.clipRect);
    this.strokeRectangle(this.bigRect);
    // this.strokeRectangle(this.smallRect);

    this.context.restore();
  }

  eraseMagnifyingGlass() {
    this.restoreData();
  }

  saveData(x, y) {
    // Area of the image that will be restored after the magnifying glass moves
    // away. Notice the extra pixels, to avoid weird antialiasing issues in some
    // browsers.
    this.clipRect = this.clampedRectangle(x, y, this.zoomWidth + 4, this.zoomHeight + 4);

    this.clipData = this.context.getImageData(
      this.clipRect.x,
      this.clipRect.y,
      this.clipRect.width,
      this.clipRect.height
    );

    // Area of the image that will represent the magnifying glass.
    this.bigRect = this.clampedRectangle(x, y, this.zoomWidth, this.zoomHeight);

    // Area of the image that will be shown inside the magnifying glass.
    this.smallRect = this.clampedRectangle(x, y, this.zoomWidth / this.zoomLevel, this.zoomHeight / this.zoomLevel);

    this.smallData = this.context.getImageData(
      this.smallRect.x,
      this.smallRect.y,
      this.smallRect.width,
      this.smallRect.height
    );
  }

  restoreData() {
    if (this.clipData != null) {
      this.context.putImageData(this.clipData, this.clipRect.x, this.clipRect.y);
    }
  }

  drawZoomedImage() {
    const target = this.bigRect;
    const source = this.smallData;
    const zoom = this.zoomLevel;

    const tx = target.x;
    const ty = target.y;
    const sw = source.width;
    const sh = source.height;
    const sd = source.data;

    let sx, sy;
    let i, r, g, b, a;

    // Iterate over every pixel in the source rectangle, and paint it on the
    // canvas using the target rectangle's coordinates.
    for (sy = 0; sy < sh; ++sy) {
      for (sx = 0; sx < sw; ++sx) {
        i = (sy * sw + sx) * 4;
        r = sd[i + 0];
        g = sd[i + 1];
        b = sd[i + 2];
        a = sd[i + 3];

        // Notice the extra pixel, to avoid weird antialiasing issues in some
        // browsers.
        this.context.strokeStyle = null;
        this.context.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
        this.context.fillRect(tx + sx * zoom, ty + sy * zoom, zoom + 1, zoom + 1);
      }
    }
  }

  clipRectangle(rect) {
    this.context.beginPath();
    this.context.rect(rect.x, rect.y, rect.width, rect.height);
    this.context.clip();
  }

  strokeRectangle(rect) {
    this.context.lineWidth = 2;
    this.context.strokeStyle = this.color;
    this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  clampedRectangle(x, y, width, height) {
    return {
      x: clamp(x - width / 2, 0, this.width - width),
      y: clamp(y - height / 2, 0, this.height - height),
      width,
      height,
    };
  }

  eventCoords(evt) {
    let x = ((evt.pageX - this.offsetLeft) * this.width) / this.realWidth;
    let y = ((evt.pageY - this.offsetTop) * this.height) / this.realHeight;
    x = clamp(x, 0, this.width - 1);
    y = clamp(y, 0, this.height - 1);

    return { x, y };
  }

  eventContainsFile(evt) {
    const transfer = evt.dataTransfer;
    const types = transfer.types;
    return types.indexOf("Files") >= 0;
  }

  eventImage(evt) {
    const transfer = evt.dataTransfer;
    const file = transfer.files[0];
    if (file.type.match(/image.*/)) {
      return file;
    }
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
