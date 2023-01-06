// @ts-check

/**
 * @typedef ClipboardInspectorOptions
 * @type {object}
 * @property {HTMLElement} dropZone - Element that acts as drop zone.
 * @property {HTMLButtonElement} pasteButton - Button to trigger `Clipboard.read()`.
 * @property {HTMLElement} output - Element that shows output.
 */

export default class ClipboardInspector {
  /**
   * @param {ClipboardInspectorOptions} options
   */
  constructor(options) {
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.onPasteAsync = this.onPasteAsync.bind(this);

    this.initOptions(options);

    document.addEventListener("dragenter", this.onDragEnter);
    document.addEventListener("dragleave", this.onDragLeave);
    document.addEventListener("dragover", this.onDragOver);
    document.addEventListener("drop", this.onDrop);
    document.addEventListener("paste", this.onPaste);

    this.pasteButton.disabled = navigator?.clipboard?.read == null;
    this.pasteButton.addEventListener("click", this.onPasteAsync);
  }

  /**
   * @param {ClipboardInspectorOptions} options
   */
  initOptions({ dropZone, pasteButton, output }) {
    this.dropZone = dropZone;
    this.pasteButton = pasteButton;
    this.output = output;
  }

  /**
   * @param {DragEvent} evt
   */
  onDragEnter(evt) {
    evt.preventDefault();
    this.highlightDrop();
  }

  /**
   * @param {DragEvent} evt
   */
  onDragLeave(evt) {
    evt.preventDefault();
    this.unhighlightDrop();
  }

  /**
   * @param {DragEvent} evt
   */
  onDragOver(evt) {
    evt.preventDefault();
    this.highlightDrop();

    evt.dataTransfer.dropEffect = "link";
  }

  /**
   * @param {DragEvent} evt
   */
  onDrop(evt) {
    evt.preventDefault();
    this.unhighlightDrop();

    this.render(evt.dataTransfer, "DragEvent.dataTransfer: DataTransfer");
  }

  /**
   * @param {ClipboardEvent} evt
   */
  onPaste(evt) {
    this.render(evt.clipboardData, "ClipboardEvent.clipboardData: DataTransfer");
  }

  async onPasteAsync() {
    // const permission = await navigator.permissions.query({ name: "clipboard-read" });
    // if (permission.state === "denied") {
    //   throw new Error("Not allowed to read clipboard.");
    // }
    const data = await navigator.clipboard.read();
    this.render(data, "Clipboard.read(): ClipboardItems");
  }

  /**
   * @param {ClipboardItem[] | DataTransfer | null} data
   * @param {string} label
   */
  async render(data, label) {
    const extractedData = await Promise.all([].concat(data ?? []).map(extractData));
    this.output.innerHTML = extractedData.map((d) => renderData(d, label)).join("");
  }

  highlightDrop() {
    this.dropZone.classList.replace("border-dashed", "border-solid");
  }

  unhighlightDrop() {
    this.dropZone.classList.replace("border-solid", "border-dashed");
  }
}

/**
 * @param {ClipboardItem | DataTransfer | null} data
 */
const extractData = (data) => {
  if (typeof ClipboardItem !== "undefined" && data instanceof ClipboardItem) {
    return extractClipboardItem(data);
  }
  if (typeof DataTransfer !== "undefined" && data instanceof DataTransfer) {
    return extractDataTransfer(data);
  }
};

/**
 * @param {ClipboardItem} data
 */
const extractClipboardItem = async (data) => ({
  source: "ClipboardItem",
  types: await Promise.all(
    data.types.map(async (type) => {
      const blob = await data.getType(type);
      return {
        type,
        data: blob.type.indexOf("text/") === 0 ? await blob.text() : extractFile(blob),
      };
    })
  ),
});

/**
 * @param {DataTransfer} data
 */
const extractDataTransfer = (data) => ({
  source: "DataTransfer",
  types: data.types.map((type) => ({
    type,
    data: data.getData(type),
  })),
  items: data.items ? [...data.items].map(extractDataTransferItem) : [],
  files: data.files ? [...data.files].map(extractFile) : [],
});

/**
 * @param {DataTransferItem} item
 */
const extractDataTransferItem = (item) => ({
  kind: item.kind,
  type: item.type,
  file: extractFile(item.getAsFile()),
});

/**
 * @param {Blob | File | null} file
 */
const extractFile = (file) =>
  file && {
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
  };

/**
 * @param {NonNullable<Awaited<ReturnType<extractData>>>} data
 * @param {string} label
 */
const renderData = (data, label) => `
<h2>${label}</h2>
${data.types ? renderTypes(data.types) : ""}
${data.items ? renderItems(data.items) : ""}
${data.files ? renderFiles(data.files) : ""}
`;

const renderTypes = (types) => {
  const body = `
<div class="overflow-x-auto">
  <table class="mb-0">
    <thead>
      <tr>
        <th scope="col">type</th>
        <th scope="col">getData(type)</th>
      </tr>
    </thead>
    <tbody>
      ${types.map(renderType).join("")}
    </tbody>
  </table>
</div>
`;
  return `
<details open>
  <summary class="text-2xl font-bold">.types (${types.length} available)</summary>
  ${types.length > 0 ? body : ""}
</details>
`;
};

const renderType = (obj) => {
  const content = escapeHtml(typeof obj.data === "object" ? renderFileUrl(obj.data) : obj.data);
  return `
<tr>
  <td>${obj.type}</td>
  <td>
    <textarea readonly class="form-textarea h-20 w-full font-mono">${content}</textarea>
  </td>
</tr>
`;
};

const renderItems = (items) => {
  const body = `
<div class="overflow-x-auto">
  <table class="mb-0">
    <thead>
      <tr>
        <th scope="col">kind</th>
        <th scope="col">type</th>
        <th scope="col">getAsFile()</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(renderItem).join("")}
    </tbody>
  </table>
</div>
`;
  return `
<details open>
  <summary class="text-2xl font-bold">.items (${items.length} available)</summary>
  ${items.length > 0 ? body : ""}
</details>
`;
};

const renderItem = (item) => `
<tr>
  <td>${item.kind}</td>
  <td>${item.type}</td>
  <td>${renderFileUrl(item.file)}</td>
</tr>
`;

const renderFiles = (files) => {
  const body = `
<div class="overflow-x-auto">
  <table class="mb-0">
    <thead>
      <tr>
        <th scope="col">name</th>
        <th scope="col">size</th>
        <th scope="col">type</th>
        <th scope="col">createObjectURL(file)</th>
      </tr>
    </thead>
    <tbody>
      ${files.map(renderFile).join("")}
    </tbody>
  </table>
</div>
`;
  return `
<details open>
  <summary class="text-2xl font-bold">.files (${files.length} available)</summary>
  ${files.length > 0 ? body : ""}
</details>
`;
};

const renderFile = (file) =>
  file &&
  `
<tr>
  <td>${file.name}</td>
  <td>${renderFileSize(file)}</td>
  <td>${file.type}</td>
  <td>${renderFileUrl(file)}</td>
</tr>
`;

const renderFileSize = ({ size }) => {
  const i = size ? Math.floor(Math.log(size) / Math.log(1000)) : 0;
  return `${(size / Math.pow(1000, i)).toFixed(2)} ${["B", "KB", "MB", "GB", "TB"][i]}`;
};

const renderFileUrl = (file) =>
  file
    ? `
<a target="_blank" href="${file.url}">
  <img src="${file.url}" class="max-w-80 !m-0 max-h-80" />
</a>
`
    : "N/A";

const escapeHtml = (html) =>
  html
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
