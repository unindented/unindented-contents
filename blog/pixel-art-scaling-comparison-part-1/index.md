+++
title = "Pixel Art Scaling Comparison — Part 1"
date = "2014-04-11"
tags = ["Pixel Art"]
+++

I've been playing with a few scaling algorithms in the [2dimagefilter](https://code.google.com/p/2dimagefilter/) project. They produce impressive results when fed pixel art, and the fact that emulators can run them in real-time is just mind-boggling.
{.lead}

<!--more-->

Here I've chosen a bunch of images to showcase the Eagle, SuperEagle, SaI, and SuperSaI algorithms. [Part 2]({{< ref "blog/pixel-art-scaling-comparison-part-2" >}}) continues with the EPX/Scale, HQx, xBR, and xBRZ algorithms.

## Eagle

Eagle is the grandfather of pixel art scaling algorithms. It's a bit long in the tooth these days, but has served as inspiration to many.

Here you can see an image scaled using Eagle, compared to your standard nearest-neighbor algorithm:

{{< figure class="u-w-col" >}}
  <canvas id="eaglec-target">
    <img id="eaglec-target-img1" alt="Image on the left" src="original@2x.png" />
    <img id="eaglec-target-img2" alt="Image on the right" src="eagle@2x.png" />
  </canvas>
{{< /figure >}}

{{< script eaglec >}}
import ImageCompare from "{{< relref "playground/image-compare" >}}compare.mjs";

new ImageCompare(document.getElementById("eaglec-target"), {
  path1: document.getElementById("eaglec-target-img1").src,
  path2: document.getElementById("eaglec-target-img2").src,
});
{{< /script >}}

And here you can see the details:

{{< figure class="u-w-col" >}}
  <canvas id="eaglez-target">
    <img id="eaglez-target-img" alt="Zoomable image" src="eagle@2x.png" />
  </canvas>
{{< /figure >}}

{{< script eaglez >}}
import ImageZoom from "{{< relref "playground/image-zoom" >}}zoom.mjs";

new ImageZoom(document.getElementById("eaglez-target"), {
  path: document.getElementById("eaglez-target-img").src,
});
{{< /script >}}

It produces some weird artifacts in areas like the roof and the barrels, but it does a decent job overall.

## SuperEagle

SuperEagle was developed by Kreed in 1999, as an enhancement of the original Eagle algorithm.

Here you can see an image scaled using SuperEagle, compared to nearest-neighbor:

{{< figure class="u-w-col" >}}
  <canvas id="seaglec-target">
    <img id="seaglec-target-img1" alt="Image on the left" src="original@2x.png" />
    <img id="seaglec-target-img2" alt="Image on the right" src="supereagle@2x.png" />
  </canvas>
{{< /figure >}}

{{< script seaglec >}}
import ImageCompare from "{{< relref "playground/image-compare" >}}compare.mjs";

new ImageCompare(document.getElementById("seaglec-target"), {
  path1: document.getElementById("seaglec-target-img1").src,
  path2: document.getElementById("seaglec-target-img2").src,
});
{{< /script >}}

And here you can see the details:

{{< figure class="u-w-col" >}}
  <canvas id="seaglez-target">
    <img id="seaglez-target-img" alt="Zoomable image" src="supereagle@2x.png" />
  </canvas>
{{< /figure >}}

{{< script seaglez >}}
import ImageZoom from "{{< relref "playground/image-zoom" >}}zoom.mjs";

new ImageZoom(document.getElementById("seaglez-target"), {
  path: document.getElementById("seaglez-target-img").src,
});
{{< /script >}}

It manages to alleviate the artifacts seen with Eagle by doing more blending, but doesn't solve them completely.

## SaI

The SaI algorithm was developed by Kreed in 1999, following a similar approach as the one used in Eagle.

Here you can see an image scaled using SaI, compared to nearest-neighbor:

{{< figure class="u-w-col" >}}
  <canvas id="saic-target">
    <img id="saic-target-img1" alt="Image on the left" src="original@2x.png" />
    <img id="saic-target-img2" alt="Image on the right" src="sai@2x.png" />
  </canvas>
{{< /figure >}}

{{< script saic >}}
import ImageCompare from "{{< relref "playground/image-compare" >}}compare.mjs";

new ImageCompare(document.getElementById("saic-target"), {
  path1: document.getElementById("saic-target-img1").src,
  path2: document.getElementById("saic-target-img2").src,
});
{{< /script >}}

And here you can see the details:

{{< figure class="u-w-col" >}}
  <canvas id="saiz-target">
    <img id="saiz-target-img" alt="Zoomable image" src="sai@2x.png" />
  </canvas>
{{< /figure >}}

{{< script saiz >}}
import ImageZoom from "{{< relref "playground/image-zoom" >}}zoom.mjs";

new ImageZoom(document.getElementById("saiz-target"), {
  path: document.getElementById("saiz-target-img").src,
});
{{< /script >}}

It does a really good job with this image. I can see why it's still popular after all these years.

## SuperSaI

SuperSaI, also written by Kreed in 1999, is a combination of the Eagle and SaI algorithms.

Here you can see an image scaled using SuperSaI, compared to nearest-neighbor:

{{< figure class="u-w-col" >}}
  <canvas id="ssaic-target">
    <img id="ssaic-target-img1" alt="Image on the left" src="original@2x.png" />
    <img id="ssaic-target-img2" alt="Image on the right" src="supersai@2x.png" />
  </canvas>
{{< /figure >}}

{{< script ssaic >}}
import ImageCompare from "{{< relref "playground/image-compare" >}}compare.mjs";

new ImageCompare(document.getElementById("ssaic-target"), {
  path1: document.getElementById("ssaic-target-img1").src,
  path2: document.getElementById("ssaic-target-img2").src,
});
{{< /script >}}

And here you can see the details:

{{< figure class="u-w-col" >}}
  <canvas id="ssaiz-target">
    <img id="ssaiz-target-img" alt="Zoomable image" src="supersai@2x.png" />
  </canvas>
{{< /figure >}}

{{< script ssaiz >}}
import ImageZoom from "{{< relref "playground/image-zoom" >}}zoom.mjs";

new ImageZoom(document.getElementById("ssaiz-target"), {
  path: document.getElementById("ssaiz-target-img").src,
});
{{< /script >}}

The additional blending doesn't do much good in this particular case, but I'm sure there are scenarios where it makes a lot of sense.

---

Continue to [Part 2]({{< ref "blog/pixel-art-scaling-comparison-part-2" >}}) if you want to check out the EPX/Scale, HQx, xBR, and xBRZ algorithms.
