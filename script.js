function processAllImages() {
  const files = document.getElementById("upload").files;
  if (!files.length) return;

  const date = document.getElementById("date").value;
  const sources = document.getElementById("sources").value;
  const structures = document.getElementById("structures").value;
  const prompt = document.getElementById("prompt").value;

  document.getElementById("results").innerHTML = ""; // clear previous

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        drawPromptOnCanvas(ctx, canvas, { date, sources, structures, prompt });

        const imgEl = document.createElement("img");
        imgEl.src = canvas.toDataURL();

        const link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = `annotated-${file.name}`;
        link.textContent = "Download Annotated Image";

        const container = document.createElement("div");
        container.className = "result-item";
        container.appendChild(imgEl);
        container.appendChild(link);

        document.getElementById("results").appendChild(container);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function drawPromptOnCanvas(ctx, canvas, values) {
  const { date, sources, structures, prompt } = values;

  const fontFamily = "Georgia, serif";
  const initialFontSize = 28;
  const leftMargin = 30;
  const bottomMargin = 30;
  const lineSpacing = 10;
  const maxTextWidth = canvas.width - leftMargin * 2;

  const linesRaw = [
    `Date: ${date}`,
    `Sources used: ${sources}`,
    `Structures: ${structures}`,
    `Prompt: ${prompt}`
  ];

  // Wrap text lines
  ctx.font = `${initialFontSize}px ${fontFamily}`;
  let wrappedLines = [];
  for (let raw of linesRaw) {
    wrappedLines.push(...wrapText(raw, maxTextWidth, ctx));
  }

  // Shrink font if necessary
  let fontSize = initialFontSize;
  let lineHeight = fontSize + lineSpacing;
  let totalHeight = wrappedLines.length * lineHeight;

  while (totalHeight + bottomMargin > canvas.height && fontSize > 12) {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${fontFamily}`;
    lineHeight = fontSize + lineSpacing;
    wrappedLines = [];
    for (let raw of linesRaw) {
      wrappedLines.push(...wrapText(raw, maxTextWidth, ctx));
    }
    totalHeight = wrappedLines.length * lineHeight;
  }

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "left";

  const startY = canvas.height - bottomMargin - (wrappedLines.length - 1) * lineHeight;

  wrappedLines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    ctx.strokeText(line, leftMargin, y);
    ctx.fillText(line, leftMargin, y);
  });
}

function wrapText(text, maxWidth, ctx) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (let word of words) {
    const testLine = currentLine + word + " ";
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && currentLine !== "") {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) lines.push(currentLine.trim());
  return lines;
}
