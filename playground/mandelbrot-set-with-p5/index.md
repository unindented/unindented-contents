+++
title = "Mandelbrot Set with p5.js"
date = "2022-04-07"
tags = ["Fractal", "Mandelbrot", "p5.js"]
katex = true
p5 = true
+++

The [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set), named after [Benoit Mandelbrot](https://en.wikipedia.org/wiki/Benoit_Mandelbrot), is the set of complex numbers $c$ for which the function $f_c(z)=z^2+c$ does not diverge to infinity when iterated from $z=0$.
{.lead}

I'm using the pseudocode from the Wikipedia article [Plotting algorithms for the Mandelbrot set](https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set) as base, and applying different coloring algorithms.

<!--more-->

## Grayscale

{{< p5
  name="mandelbrot-grayscale"
  caption="Mandelbrot set with an escape radius of 2.0, and a maximum of 40 iterations."
  class="u-w-bleed"
>}}
import sketch from "./grayscale.mjs";

sketch(document.getElementById("mandelbrot-grayscale"), {
  escapeRadius: 2,
  maxIterations: 40,
});
{{< /p5 >}}

In this version we're mapping the number of iterations for each pixel (in the range `[0, maxIterations]`) to a brightness value (in the range `[0, 255]`).

With `maxIterations` set to 40 we get very visible bands. We can increase that value to be closer to 255 to reduce banding, but then computing each pixel becomes more expensive. Also, the edges of the set become too sharp, and the resulting image is less appealing overall.

## Histogram

{{< p5
  name="mandelbrot-histogram"
  caption="Mandelbrot set with an escape radius of 2.0, a maximum of 40 iterations, and a palette of 64 colors."
  class="u-w-bleed"
>}}
import sketch from "./histogram.mjs";

sketch(document.getElementById("mandelbrot-histogram"), {
  escapeRadius: 2,
  maxIterations: 40,
  numColors: 64,
});
{{< /p5 >}}

In this version we're mapping the number of iterations for each pixel (in the range `[0, maxIterations]`) to a color in a certain palette (in the range `[0, numColors]`).

The palette tries to mimic the default one from [UltraFractal](https://www.ultrafractal.com/):

```javascript
gradient.addColorStop(0.0,    "rgb(  0,   7, 100)");
gradient.addColorStop(0.16,   "rgb( 32, 107, 203)");
gradient.addColorStop(0.42,   "rgb(237, 255, 255)");
gradient.addColorStop(0.6425, "rgb(255, 170,   0)");
gradient.addColorStop(0.8575, "rgb(  0,   2,   0)");
```

With `maxIterations` set to 40 the bands are as obvious as in the previous version. Increasing the size of the palette with `numColors` doesn't make things any better, because we're still dealing with a stair-step function.

## Continuous

{{< p5
  name="mandelbrot-continuous"
  caption="Mandelbrot set with an escape radius of 2.0, a maximum of 40 iterations, 8 extra iterations for quick escapes, and a palette of 2048 colors."
  class="u-w-bleed"
>}}
import sketch from "./continuous.mjs";

sketch(document.getElementById("mandelbrot-continuous"), {
  escapeRadius: 2,
  maxIterations: 40,
  extraIterations: 8,
  numColors: 2048,
});
{{< /p5 >}}

This version uses an algorithm known as [normalized iteration count](https://linas.org/art-gallery/escape/escape.html) to smooth the transition between colors. The formula for obtaining that fractional count is:

<div>
$$
n + 1 - {\frac {log(log(|z_n|))}{log(2)}}
$$
</div>

Applying some logarithm rules (change of base, power), we can turn it into what you see in my code:

<div>
$$
n + 1 - log_2({\frac {log(x^2+y^2)}{2}})
$$
</div>

With `maxIterations` set to 40, `extraIterations` set to 8, and `numColors` set to 2048, we get very impressive results.
