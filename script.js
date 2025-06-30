const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let uploadedImage = new Image();

document.getElementById("upload").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    uploadedImage.onload = function () {
      canvas.width = uploadedImage.width;
      canvas.height = uploadedImage.height;
      ctx.drawImage(uploadedImage, 0, 0);
    };
    uploadedImage.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function addTextToImage() {
  if (!uploadedImage.src) return;

  ctx.drawImage(uploadedImage, 0, 0);

  const fontFamily = "Georgia, serif";
  const initialFontSize = 28;
  const leftMargin = 30;
  const bottomMargin = 30;
  const lineSpacing = 10;
  const maxTextWidth = canvas.width - leftMargin * 2;

  // Get user input values
  const linesRaw = [
    `Date: ${document.getElementById("date").value}`,
    `Sources used: ${document.getElementById("sources").value}`,
    `Structures: ${document.getElementById("structures").value}`,
    `Prompt: ${document.getElementById("prompt").value}`
  ];

  // Wrap each text block into multiple lines
  let wrappedLines = [];

  ctx.font = `${initialFontSize}px ${fontFamily}`;
  for (let rawLine of linesRaw) {
    wrappedLines.push(...wrapText(rawLine, maxTextWidth, ctx));
  }

  // Estimate total height needed
  let lineHeight = initialFontSize + lineSpacing;
  let totalTextHeight = wrappedLines.length * lineHeight;

  // If text would overflow vertically, scale down font
  let fontSize = initialFontSize;
  while (totalTextHeight + bottomMargin > canvas.height && fontSize > 12) {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${fontFamily}`;
    lineHeight = fontSize + lineSpacing;
    wrappedLines = [];
    for (let rawLine of linesRaw) {
      wrappedLines.push(...wrapText(rawLine, maxTextWidth, ctx));
    }
    totalTextHeight = wrappedLines.length * lineHeight;
  }

  // Now draw each line from bottom up
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "left";

  let startY = canvas.height - bottomMargin - (wrappedLines.length - 1) * lineHeight;
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

function downloadImage() {
  const link = document.createElement("a");
  link.download = "modified-image.png";
  link.href = canvas.toDataURL();
  link.click();
}
