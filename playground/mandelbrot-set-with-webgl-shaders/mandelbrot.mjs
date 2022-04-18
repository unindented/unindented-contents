const sketch = (element, options) => ($) => {
  const aspectRatio = 2 / 1;
  const size = () => [Math.round(element.offsetWidth), Math.round(element.offsetWidth / aspectRatio)];

  let shader;

  $.preload = () => {
    shader = $.loadShader("mandelbrot.vert", `${options.variant}.frag`);
  };

  $.setup = () => {
    $.createCanvas(...size(), $.WEBGL);

    $.noStroke();
  };

  $.windowResized = () => {
    const [width, height] = size();

    if (width !== width || height !== height) {
      $.resizeCanvas(width, height);
    }
  };

  $.draw = () => {
    shader.setUniform("iResolution", [$.width * $.pixelDensity(), $.height * $.pixelDensity()]);
    $.shader(shader);
    $.rect(0, 0, $.width, $.height);

    if ($.frameCount > 1) {
      $.noLoop();
    }
  };
};

export default (element, options) => new p5(sketch(element, options), element);
