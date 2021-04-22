+++
title = "JWT Decoder in the Browser"
date = "2021-04-22"
tags = ["Security", "Utils"]
+++

Decode [JSON web tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) right in the browser. Nothing gets recorded, everything is done client-side.
{.lead}

<!--more-->

{{< figure class="u-w-bleed" >}}
  <form class="mx-4 flex flex-col gap-4 sm:mx-8 sm:flex-row">
    <label class="form-label-block flex flex-1">
      <span>Your token</span>
      <textarea required id="decode-input" class="form-textarea flex-1 resize-none font-mono">
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea
      >
    </label>
    <div class="flex-1">
      <label class="form-label-block">
        <span>Decoded header</span>
        <output
          for="decode-input"
          id="decode-header-output"
          class="form-textarea whitespace-pre-wrap font-mono text-base text-gray-600 dark:text-gray-400"
        ></output>
      </label>
      <label class="form-label-block">
        <span>Decoded body</span>
        <output
          for="decode-input"
          id="decode-body-output"
          class="form-textarea whitespace-pre-wrap font-mono text-base text-gray-600 dark:text-gray-400"
        ></output>
      </label>
    </div>
  </form>
{{< /figure >}}

{{< script >}}
import { decode } from "./jwt.mjs";

const input = document.getElementById("decode-input");
const headerOutput = document.getElementById("decode-header-output");
const bodyOutput = document.getElementById("decode-body-output");

const updateOutput = (value) => {
  headerOutput.value = JSON.stringify(decode(value, { header: true }), null, 2);
  bodyOutput.value = JSON.stringify(decode(value, { header: false }), null, 2);
};

input.addEventListener("input", (evt) => {
  updateOutput(evt.target.value);
});

updateOutput(input.value);

{{< /script >}}
