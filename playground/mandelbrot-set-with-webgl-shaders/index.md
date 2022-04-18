+++
title = "Mandelbrot Set with WebGL"
date = "2022-04-19"
tags = ["Fractal", "Mandelbrot", "p5.js", "WebGL"]
katex = true
p5 = true
+++

Plotting the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) with a GLSL fragment shader.
{.lead}

I've translated the code I wrote for [plotting the Mandelbrot set with p5.js]({{< ref "playground/mandelbrot-set-with-p5" >}}) to a GLSL 1.0 fragment shader. The main difference is that I'm using `vec2` to represent complex numbers, which makes things a bit more concise.

<!--more-->

## Grayscale

{{< p5
  name="mandelbrot-grayscale"
  caption="Mandelbrot set with an escape radius of 4.0, and a maximum of 40 iterations."
  class="u-w-bleed"
>}}
import sketch from "./mandelbrot.mjs";

sketch(document.getElementById("mandelbrot-grayscale"), {
  variant: "grayscale",
});
{{< /p5 >}}

In this version we're mapping the number of iterations for each pixel (in the range `[0, maxIterations]`) to a brightness value (in the range `[0, 1]`).

## Histogram

{{< p5
  name="mandelbrot-histogram"
  caption="Mandelbrot set with an escape radius of 4.0, a maximum of 40 iterations, and a procedurally generated palette."
  class="u-w-bleed"
>}}
import sketch from "./mandelbrot.mjs";

sketch(document.getElementById("mandelbrot-histogram"), {
  variant: "histogram",
});
{{< /p5 >}}

In this version we're mapping the number of iterations for each pixel (in the range `[0, maxIterations]`) to a color, using these two functions:

```glsl
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

vec3 color(float t) {
  vec3 a = vec3(0.5);
  vec3 b = vec3(0.5);
  vec3 c = vec3(1.0);
  vec3 d = vec3(0.0, 0.1, 0.2);
  return palette(fract(t + 0.5), a, b, c, d);
}
```

How the heck does that code generate a color palette? Read [this article by its author, Iñigo Quilez](https://iquilezles.org/articles/palettes/).

## Continuous

{{< p5
  name="mandelbrot-continuous"
  caption="Mandelbrot set with an escape radius of 4.0, a maximum of 40 iterations, and a procedurally generated palette."
  class="u-w-bleed"
>}}
import sketch from "./mandelbrot.mjs";

sketch(document.getElementById("mandelbrot-continuous"), {
  variant: "continuous",
});
{{< /p5 >}}

This version uses an algorithm known as [normalized iteration count](https://linas.org/art-gallery/escape/escape.html) to smooth the transition between colors. The formula for obtaining that fractional count is:

<div>
$$
n + 1 - {\frac {log(log(|z_n|))}{log(2)}}
$$
</div>

Applying some vector and logarithm rules, we can turn it into what you see in my code:

<div>
$$
n + 1 - log_2({\frac {log(z \cdot z)}{2}})
$$
</div>
