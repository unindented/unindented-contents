+++
title = "JWT Decode"
date = "2021-04-22"
tags = ["Utils"]
+++

Decode [JSON web tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) right in the browser. Nothing gets recorded, everything is done on the client side.

<!--more-->

<figure class="content-width-wrapper">
  <link rel="stylesheet" href="form.css" />

  <form class="form">
    <div class="input-wrapper">
      <label for="decode-input">Your token</label>
      <textarea required id="decode-input" class="input">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea>
    </div>
    <div class="output-wrapper">
      <div>
        <label for="decode-header-output">Decoded header</label>
        <output id="decode-header-output" for="decode-input" class="output"></output>
      </div>
      <div>
        <label for="decode-body-output">Decoded body</label>
        <output id="decode-body-output" for="decode-input" class="output"></output>
      </div>
    </div>
  </form>
</figure>

{{< script >}}
import { decode } from "./decode.mjs";

const input = document.getElementById("decode-input");
const headerOutput = document.getElementById("decode-header-output");
const bodyOutput = document.getElementById("decode-body-output");

const updateOutput = (input) => {
headerOutput.value = JSON.stringify(decode(input.value, { header: true }), null, 2);
bodyOutput.value = JSON.stringify(decode(input.value, { header: false }), null, 2);
};

input.addEventListener("input", (evt) => {
updateOutput(evt.target);
});

updateOutput(input);
{{< /script >}}
