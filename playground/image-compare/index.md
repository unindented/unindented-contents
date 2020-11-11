+++
title = "Compare Two Images Side-by-Side"
date = "2014-04-09"
tags = ["Canvas", "Pixel Art"]
+++

Small widget to compare two images side by side, for my articles on pixel art scaling (parts [one]({{< ref "blog/pixel-art-scaling-comparison-part-1" >}}) and [two]({{< ref "blog/pixel-art-scaling-comparison-part-2" >}})).
{.lead}

<!--more-->

{{< figure
  caption="Try dragging and dropping your own image files in here."
  class="u-w-col"
>}}
  <canvas id="compare-target">
    <img id="compare-target-img1" alt="Image on the left" src="original@2x.png" loading="lazy" />
    <img id="compare-target-img2" alt="Image on the right" src="sepia@2x.png" loading="lazy" />
  </canvas>
{{< /figure >}}

{{< script >}}
import ImageCompare from "./compare.mjs";

new ImageCompare(document.getElementById("compare-target"), {
  path1: document.getElementById("compare-target-img1").src,
  path2: document.getElementById("compare-target-img2").src,
  editable: true,
});
{{< /script >}}

The [TwentyTwenty](https://zurb.com/playground/twentytwenty) jQuery plugin does this beautifully, but I wanted to avoid external dependencies.

The whole thing turned out to be relatively straightforward, using [`drawImage`](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawImage).
