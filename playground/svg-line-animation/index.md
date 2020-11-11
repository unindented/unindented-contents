+++
title = "SVG Line Animation"
date = "2014-12-01"
tags = ["SVG"]
+++

You know that cool animation that [Polygon](https://www.polygon.com/) used in their [Xbox One](https://www.polygon.com/a/xbox-one-review) and [PS4](https://www.polygon.com/a/ps4-review) reviews, where SVG images appeared to draw progressively? It's really easy to do.
{.lead}

<!--more-->

Let's draw the Xbox One controller:

{{< figure class="u-w-col" >}}
  {{< readfile "playground/svg-line-animation/xbone-controller.svg" >}}
{{< /figure >}}

{{< script xbone >}}
import SvgAnimator from "./animator.mjs";

new SvgAnimator(document.getElementById("xbone-target"), { duration: 30000 });
{{< /script >}}

And the PS4 one too:

{{< figure class="u-w-col" >}}
  {{< readfile "playground/svg-line-animation/ps4-controller.svg" >}}
{{< /figure >}}

{{< script ps4 >}}
import SvgAnimator from "./animator.mjs";

new SvgAnimator(document.getElementById("ps4-target"), { duration: 40000 });
{{< /script >}}

The way this works is by setting the `stroke-dasharray` property of each path to its total length, and then animating the `stroke-dashoffset` property.
