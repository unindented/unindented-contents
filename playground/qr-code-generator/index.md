+++
title = "QR Code Generator"
date = "2023-05-17"
tags = ["QR Code", "Utils"]
+++

Whip up a QR code that can be scanned by anyone with a smartphone or a QR code reader. All thanks to the awesome [`headless-qr`](https://github.com/Rich-Harris/headless-qr) module by [Rich Harris](https://github.com/Rich-Harris).
{.lead}

<!--more-->

{{< figure class="u-w-bleed" >}}
  <form class="mx-4 flex flex-col gap-4 sm:mx-8 sm:flex-row">
    <div class="flex flex-[2] flex-col">
      <label class="form-label-block flex-1">
        <span>Input</span>
        <textarea
          placeholder="Enter a URL, or any text really"
          id="qr-input"
          class="form-textarea w-full flex-1 resize-none font-mono"
        ></textarea>
      </label>
      <fieldset class="form-fieldset">
        <legend>Correction</legend>
        <div class="flex flex-col lg:flex-row lg:gap-4">
          <label class="form-label-inline">
            <input type="radio" name="qr-correction" value="L" checked class="form-radio" />
            <span>Low&nbsp;(7%)</span>
          </label>
          <label class="form-label-inline">
            <input type="radio" name="qr-correction" value="M" class="form-radio" />
            <span>Medium&nbsp;(15%)</span>
          </label>
          <label class="form-label-inline">
            <input type="radio" name="qr-correction" value="Q" class="form-radio" />
            <span>Quartile&nbsp;(25%)</span>
          </label>
          <label class="form-label-inline">
            <input type="radio" name="qr-correction" value="H" class="form-radio" />
            <span>High&nbsp;(30%)</span>
          </label>
        </div>
      </fieldset>
    </div>
    <label class="form-label-block flex-1">
      <span>QR code</span>
      <div class="flex-1 bg-white p-[10%]">
        <svg id="qr-output" class="shape-crisp-edges" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
    </label>
  </form>
{{< /figure >}}

{{< script >}}
import { qr } from "./qr.mjs";

const input = document.querySelector("#qr-input");
const corrections = [...document.querySelectorAll('[name="qr-correction"]')];
const svg = document.getElementById("qr-output");
const svgWidth = 1000;

const updateOutput = () => {
  const inputValue = input.value ?? "";
  const correctionValue = corrections.find((correction) => correction.checked)?.value ?? "L";

  const bits = qr(inputValue, { correction: correctionValue });
  const cellSize = Math.round(svgWidth / bits.length);

  svg.replaceChildren();

  const fragment = new DocumentFragment();

  for (let y = 0; y < bits.length; y++) {
    for (let x = 0; x < bits[y].length; x++) {
      if (!bits[y][x]) {
        continue;
      }

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x * cellSize);
      rect.setAttribute("y", y * cellSize);
      rect.setAttribute("width", cellSize);
      rect.setAttribute("height", cellSize);
      rect.setAttribute("fill", "#000");
      fragment.appendChild(rect);
    }
  }

  svg.appendChild(fragment);
};

input.addEventListener("input", updateOutput);

corrections.forEach((correction) => {
  correction.addEventListener("change", updateOutput);
});

updateOutput();
{{< /script >}}
