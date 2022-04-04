+++
title = "WebRTC without Signaling Server"
date = "2022-03-31"
tags = ["WebRTC"]
+++

I was reading [MDN's article on signaling and video calling](https://developer.mozilla.org/docs/Web/API/WebRTC_API/Signaling_and_video_calling), and encountered this part:
{.lead}

> WebRTC is a fully peer-to-peer technology for the real-time exchange of audio, video, and data, with <mark>one central caveat</mark>. A form of discovery and media format negotiation must take place, as discussed elsewhere, in order for two devices on different networks to locate one another. This process is called signaling and involves both devices <mark>connecting to a third, mutually agreed-upon server</mark>. Through this third server, the two devices can locate one another, and exchange negotiation messages.

It then goes on to talk about [SDP](https://developer.mozilla.org/docs/Glossary/SDP), the protocol used to exchange signaling information, and guides you through implementing a video-calling app.

I started wondering, do you really need that third server? Is there anything preventing peers from exchanging the SDP offer and answer through some other means, like IRC or similar? It turns out there's not!

<!--more-->

Try the following:

1. Press the _Create_ button below to create an **SDP offer**.
1. Copy the offer, and send it to someone. _(Let's call her Alice.)_
1. Have Alice go to this same URL, and paste the offer you sent her.
1. An **SDP answer** will be generated. Have Alice send it back to you.
1. Paste the answer, and an RTC connection between you two will be established.
1. You can now see and message each other. Profit!

{{< note >}}
In my implementation, both offer and answer are compressed using [`lz-string`](https://pieroxy.net/blog/pages/lz-string/index.html), so that they're easier to send around, but it's not a requirement.
{{< /note >}}

---

{{< figure class="u-w-bleed" >}}
  <div class="relative">
    <input type="checkbox" id="chat-video-checkbox" class="peer hidden" />
    <video
      autoplay
      muted
      id="chat-video-own"
      class="bottom-0 right-0 z-10 !m-0 w-full transition-all duration-1000 ease-in-out peer-checked:absolute peer-checked:w-1/4"
    ></video>
    <video autoplay id="chat-video-peer" class="z-0 !m-0 hidden w-full peer-checked:block"></video>
  </div>

  <form id="chat-form" class="mx-4 flex flex-col gap-4 sm:mx-8">
    <fieldset class="form-fieldset mt-8">
      <legend>Signaling</legend>
      <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-4">
          <label class="form-label-inline flex-1 gap-4">
            <span class="w-20">Offer:</span>
            <input type="text" id="chat-offer-input" class="form-input w-full" />
          </label>
          <button type="button" id="chat-offer-button" class="form-button form-button-primary">Create</button>
        </div>
        <label class="form-label-inline flex-1 gap-4">
          <span class="w-20">Answer:</span>
          <input type="text" id="chat-answer-input" class="form-input w-full" />
        </label>
      </div>
    </fieldset>
    <fieldset class="form-fieldset">
      <legend>Chat</legend>
      <div class="flex flex-col gap-4">
        <div
          id="chat-message-output"
          aria-live="polite"
          class="form-textarea max-h-[12rem] min-h-[6rem] overflow-y-auto whitespace-pre-wrap text-gray-600 dark:text-gray-400"
        ></div>
        <div class="flex flex-row gap-4">
          <label class="form-label-inline flex-1 gap-4">
            <span class="w-24">Message:</span>
            <input type="text" id="chat-message-input" class="form-input w-full" />
          </label>
          <button type="submit" id="chat-message-button" class="form-button form-button-primary">Send</button>
        </div>
      </div>
    </fieldset>
  </form>
{{< /figure >}}

{{< script >}}
import { compressToBase64, decompressFromBase64 } from "{{< relref "playground/lz-string" >}}lz.mjs";
import Chat from "./chat.mjs";

new Chat({
  compress: compressToBase64,
  decompress: decompressFromBase64,
  videoCheckbox: document.getElementById('chat-video-checkbox'),
  videoOwn: document.getElementById('chat-video-own'),
  videoPeer: document.getElementById('chat-video-peer'),
  form: document.getElementById('chat-form'),
  offerButton: document.getElementById('chat-offer-button'),
  offerInput: document.getElementById('chat-offer-input'),
  answerInput: document.getElementById('chat-answer-input'),
  chatOutput: document.getElementById('chat-message-output'),
  chatInput: document.getElementById('chat-message-input'),
  chatButton: document.getElementById('chat-message-button'),
});
{{< /script >}}
