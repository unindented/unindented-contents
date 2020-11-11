const defaults = {
  sx: 0.1,
  sy: 0,
  sz: 0,
  max: 1000,
};

export default class LorenzAttractor {
  constructor(target, options) {
    this.initOptions(Object.assign({}, defaults, options));
    this.initTarget(target);
    this.initNodes();

    this.animate();
  }

  animate() {
    const a = 10;
    const b = 28;
    const c = 8.0 / 3.0;
    const t = 0.01;

    let i = 0;
    let x = this.sx;
    let y = this.sy;
    let z = this.sz;

    const step = () => {
      const xt = x + t * a * (y - x);
      const yt = y + t * (x * (b - z) - y);
      const zt = z + t * (x * y - c * z);

      this.updateNode(i, xt, yt, zt);

      i = (i + 1) % this.max;
      x = xt;
      y = yt;
      z = zt;

      window.requestAnimationFrame(step);
    };

    step();
  }

  initOptions(options) {
    this.sx = options.sx;
    this.sy = options.sy;
    this.sz = options.sz;
    this.max = options.max;
  }

  initTarget(target) {
    this.target = target;
  }

  initNodes() {
    this.nodes = [];

    for (let i = 0, l = this.max; i < l; i++) {
      this.nodes.push(this.target.appendChild(document.createElement("span")));
    }
  }

  updateNode(i, x, y, z) {
    x = 50 + 2.5 * x;
    y = 50 + 2 * y;
    z = Math.abs(z / 2);

    const cssText = `left: ${x}%; top: ${y}%; width: ${z}px; height: ${z}px;`;
    this.nodes[i].style.cssText = cssText;
  }
}
