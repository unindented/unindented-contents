+++
title = "Compress Strings with lz‑string"
date = "2022-03-30"
tags = ["Compression", "Utils"]
+++

I wanted to compress some large strings in JavaScript, for an [experiment with WebRTC]({{< ref "playground/webrtc-without-signaling-server" >}}), and found the excellent [`lz-string`](https://pieroxy.net/blog/pages/lz-string/index.html) by [pieroxy](https://pieroxy.net/).
{.lead}

It's fast, and it weighs just a little over 4KB if you run it through something like [Terser](https://terser.org/). I've tweaked it ever so slightly for my needs, but it should still be 100% compatible with the original. You can play with it below.

<!--more-->

---

{{< figure class="u-w-col" >}}
  <form class="flex flex-col gap-4">
    <label class="form-label-block">
      <span>Original <span id="string-original-label" class="text-gray-600 dark:text-gray-400"></span></span>
      <textarea id="string-original" class="form-textarea w-full font-mono">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ornare nisi at augue ullamcorper, eget faucibus magna eleifend.</textarea
      >
    </label>
    <label class="form-label-block">
      <span>Compressed <span id="string-compressed-plain-label" class="text-gray-600 dark:text-gray-400"></span></span>
      <output
        for="string-original"
        id="string-compressed-plain"
        class="form-textarea max-h-[12rem] overflow-y-auto whitespace-pre-wrap font-mono text-base text-gray-600 dark:text-gray-400"
      ></output>
    </label>
    <label class="form-label-block">
      <span
        >Compressed UTF16 <span id="string-compressed-utf16-label" class="text-gray-600 dark:text-gray-400"></span
      ></span>
      <output
        for="string-original"
        id="string-compressed-utf16"
        class="form-textarea max-h-[12rem] overflow-y-auto whitespace-pre-wrap font-mono text-base text-gray-600 dark:text-gray-400"
      ></output>
    </label>
    <label class="form-label-block">
      <span
        >Compressed Base64 <span id="string-compressed-base64-label" class="text-gray-600 dark:text-gray-400"></span
      ></span>
      <output
        for="string-original"
        id="string-compressed-base64"
        class="form-textarea max-h-[12rem] overflow-y-auto whitespace-pre-wrap font-mono text-base text-gray-600 dark:text-gray-400"
      ></output>
    </label>
    <label class="form-label-block">
      <span
        >Compressed Encoded URI <span id="string-compressed-uri-label" class="text-gray-600 dark:text-gray-400"></span
      ></span>
      <output
        for="string-original"
        id="string-compressed-uri"
        class="form-textarea max-h-[12rem] overflow-y-auto whitespace-pre-wrap font-mono text-base text-gray-600 dark:text-gray-400"
      ></output>
    </label>
    <label class="form-label-block">
      <span
        >Compressed Uint8Array <span id="string-compressed-uint8-label" class="text-gray-600 dark:text-gray-400"></span
      ></span>
      <output
        for="string-original"
        id="string-compressed-uint8"
        class="form-textarea max-h-[12rem] overflow-y-auto whitespace-pre-wrap font-mono text-base text-gray-600 dark:text-gray-400"
      ></output>
    </label>
  </form>
{{< /figure >}}

{{< script >}}
import * as LZ from "./lz.mjs";

const stringToHex = (str) => {
  const result = [];

  for (let i = 0, l = str.length; i < l; i++) {
    const hex = str.charCodeAt(i).toString(16).padStart(4, "0");
    result.push(hex.slice(2, 4));
    result.push(" ");
    result.push(hex.slice(0, 2));
    result.push((i + 1) % 8 === 0 ? "\n" : " ");
  }

  return result.join("").trim();
};

const original = {
  input: document.getElementById("string-original"),
  label: document.getElementById("string-original-label"),
  size: (value) => value.length * 2,
};

const compressed = {
  plain: {
    output: document.getElementById(`string-compressed-plain`),
    label: document.getElementById(`string-compressed-plain-label`),
    compress: LZ.compress,
    serialize: stringToHex,
    size: (value) => value.length * 2,
  },
  utf16: {
    output: document.getElementById(`string-compressed-utf16`),
    label: document.getElementById(`string-compressed-utf16-label`),
    compress: LZ.compressToUTF16,
    serialize: stringToHex,
    size: (value) => value.length * 2,
  },
  base64: {
    output: document.getElementById(`string-compressed-base64`),
    label: document.getElementById(`string-compressed-base64-label`),
    compress: LZ.compressToBase64,
    serialize: (value) => value,
    size: (value) => value.length * 2,
  },
  uri: {
    output: document.getElementById(`string-compressed-uri`),
    label: document.getElementById(`string-compressed-uri-label`),
    compress: LZ.compressToEncodedURIComponent,
    serialize: (value) => value,
    size: (value) => value.length * 2,
  },
  uint8: {
    output: document.getElementById(`string-compressed-uint8`),
    label: document.getElementById(`string-compressed-uint8-label`),
    compress: LZ.compressToUint8Array,
    serialize: (value) => `[${value}]`,
    size: (value) => value.byteLength,
  },
};

const update = (originalValue) => {
  const originalSize = original.size(originalValue);
  original.label.textContent = `(${originalSize} bytes)`;

  for (const type in compressed) {
    const compressedVariant = compressed[type];
    const compressedValue = compressedVariant.compress(originalValue);
    const compressedSerializedValue = compressedVariant.serialize(compressedValue);
    const compressedSize = compressedVariant.size(compressedValue);
    const compressedPercent = originalSize > 0 ? Math.round((compressedSize / originalSize) * 100) : undefined;
    const compressedLabel = `${compressedSize} bytes` + (compressedPercent ? ` — ${compressedPercent}%` : "");
    compressedVariant.output.value = compressedSerializedValue;
    compressedVariant.label.textContent = `(${compressedLabel})`;
  }
};

original.input.addEventListener("input", (evt) => {
  update(evt.target.value);
});

update(original.input.value);
{{< /script >}}
