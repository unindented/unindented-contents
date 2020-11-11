+++
title = "SVG Painter"
date = "2014-12-01"
tags = ["SVG"]
+++

You know that cool animation that [Polygon](https://www.polygon.com/) used in their [Xbox One](https://www.polygon.com/a/xbox-one-review) and [PS4](https://www.polygon.com/a/ps4-review) reviews, where SVG images appeared to draw progressively? It's really easy to do. You just need to set the `stroke-dasharray` property of each path to its total length, and then animate the `stroke-dashoffset` property.

<!--more-->

Let's paint the Xbox One controller:

<figure class="full-width-wrapper">
  {{< readfile "playground/svg-painter/xbone-controller.svg" >}}
</figure>

{{< script xbone >}}
import SvgPainter from "./painter.mjs";

new SvgPainter(document.getElementById("xbone-target"), { duration: 30000 });
{{< /script >}}

And the PS4 one too:

<figure class="full-width-wrapper">
  {{< readfile "playground/svg-painter/ps4-controller.svg" >}}
</figure>

{{< script ps4 >}}
import SvgPainter from "./painter.mjs";

new SvgPainter(document.getElementById("ps4-target"), { duration: 40000 });
{{< /script >}}
