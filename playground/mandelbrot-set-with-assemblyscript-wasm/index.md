+++
title = "Mandelbrot Set with AssemblyScript / WebAssembly"
date = "2022-04-13"
tags = ["AssemblyScript", "Fractal", "Mandelbrot", "WebAssembly"]
+++

Plotting the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) with [AssemblyScript](https://www.assemblyscript.org), a TypeScript-like language that compiles to WebAssembly bytecode.
{.lead}

I've translated the code I wrote for [plotting the Mandelbrot set with p5.js]({{< ref "playground/mandelbrot-set-with-p5" >}}) to AssemblyScript, to get a feel for it.

<!--more-->

{{< figure
  caption="Mandelbrot set with an escape radius of 2.0, a maximum of 40 iterations, 8 extra iterations for quick escapes, and a palette of 2048 colors."
  class="u-w-bleed"
>}}
  <canvas id="mandelbrot-target" class="w-full"></canvas>
{{< /figure >}}

{{< script >}}
import MandelbrotGenerator from "./mandelbrot.mjs";

new MandelbrotGenerator(document.getElementById("mandelbrot-target"), {
  escapeRadius: 2.0,
  maxIterations: 40,
  extraIterations: 8,
  numColors: 2048,
}).init();
{{< /script >}}

I measured rendering times on my device, with a 2560x1280 canvas, and got the following results:

<div class="overflow-x-auto">
  <table>
    <thead>
      <tr>
        <th scope="col" class="text-right"></th>
        <th scope="col" class="text-center">Chromium 100</th>
        <th scope="col" class="text-center">Firefox 98</th>
        <th scope="col" class="text-center">Safari 15.4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-right"><strong>p5.js</strong></td>
        <td class="text-center">546 ms</td>
        <td class="text-center">788 ms</td>
        <td class="text-center">809 ms</td>
      </tr>
      <tr>
        <td class="text-right"><strong>AssemblyScript</strong></td>
        <td class="text-center">241 ms</td>
        <td class="text-center">175 ms</td>
        <td class="text-center">241 ms</td>
      </tr>
    </tbody>
  </table>
</div>

Also, the `.wasm` file is only 555 B!
