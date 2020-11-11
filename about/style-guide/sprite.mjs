const defaults = {
  width: 640,
  height: 480,
  timeBetweenFrames: 70,
};

export default class SpritePlayer {
  constructor(canvas, options) {
    this.animate = this.animate.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);

    this.initOptions(Object.assign({}, defaults, options));
    this.initCanvas(canvas);
    this.initSprite();
  }

  render() {
    this.clearCanvas();
    this.drawSprite();
  }

  animate(timeNow = 0) {
    if (timeNow - this.timeSinceLastFrame > this.timeBetweenFrames) {
      this.render();
      this.currentFrame = (this.currentFrame + 1) % this.frames;
      this.timeSinceLastFrame = timeNow;
    }

    window.requestAnimationFrame(this.animate);
  }

  onImageLoad() {
    this.imageWidth = this.image.width / this.frames;
    this.imageHeight = this.image.height;
    this.animate();
  }

  initOptions(options) {
    this.width = options.width;
    this.height = options.height;
    this.sprite = options.sprite;
    this.frames = options.frames;
    this.timeBetweenFrames = options.timeBetweenFrames;
    this.timeSinceLastFrame = 0;
    this.currentFrame = 0;
  }

  initCanvas(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    this.ratio = window.devicePixelRatio || 1;

    this.canvas.width = this.width * this.ratio;
    this.canvas.height = this.height * this.ratio;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "auto";

    this.context.scale(this.ratio, this.ratio);
    this.context.imageSmoothingEnabled = false;
  }

  initSprite() {
    this.image = new Image();
    this.image.addEventListener("load", this.onImageLoad);
    this.image.src = this.sprite;
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  drawSprite() {
    const srcOffsetX = this.currentFrame * this.imageWidth;
    const srcOffsetY = 0;
    const srcImageWidth = this.imageWidth;
    const srcImageHeight = this.imageHeight;

    const margin = 100;
    const imageRatioX = (this.width - margin) / srcImageWidth;
    const imageRatioY = (this.height - margin) / srcImageHeight;
    const imageRatio = Math.min(imageRatioX, imageRatioY);
    const destImageWidth = srcImageWidth * imageRatio;
    const destImageHeight = srcImageHeight * imageRatio;
    const destOffsetX = (this.width - destImageWidth) / 2;
    const destOffsetY = (this.height - destImageHeight) / 2;

    this.context.drawImage(
      this.image,
      srcOffsetX,
      srcOffsetY,
      srcImageWidth,
      srcImageHeight,
      destOffsetX,
      destOffsetY,
      destImageWidth,
      destImageHeight
    );
  }
}
