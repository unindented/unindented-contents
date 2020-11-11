const defaults = {
  strategy: "sequential",
  duration: 10000,
  frequency: 60 / 1000,
};

export default class SvgAnimator {
  constructor(svg, options) {
    this.animate = this.animate.bind(this);

    this.initOptions(Object.assign({}, defaults, options));
    this.initSvg(svg);
    this.initPaths();

    this.animate();
  }

  animate() {
    if (this.strategy()) {
      window.requestAnimationFrame(this.animate);
    }
  }

  initOptions(options) {
    this.strategy = this[options.strategy];
    this.duration = options.duration;
    this.frequency = options.frequency;
  }

  initSvg(svg) {
    this.svg = svg;
  }

  initPaths() {
    this.paths = [];
    this.length = 0;

    this.svg.querySelectorAll("path").forEach((elem) => {
      const path = this.initPath(elem);

      this.paths.push(path);
      this.length += path.length;
    });
  }

  initPath(elem) {
    const length = elem.getTotalLength();

    elem.style.strokeDasharray = length + " " + length;
    elem.style.strokeDashoffset = length;

    return {
      elem,
      length,
      offset: length,
    };
  }

  sequential() {
    this.inc = this.inc || this.length / this.duration / this.frequency;
    this.path = this.path || this.paths.shift();

    const path = this.path;
    const elem = path.elem;

    path.offset = Math.max(path.offset - this.inc, 0);
    elem.style.strokeDashoffset = path.offset;

    if (path.offset === 0) {
      elem.style.strokeDasharray = null;
      elem.style.strokeDashoffset = null;

      this.path = this.paths.shift();
    }

    return this.path != null;
  }
}
