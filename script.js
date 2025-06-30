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

  // Redraw original image
  ctx.drawImage(uploadedImage, 0, 0);

  // Font settings
  ctx.font = "28px Georgia, serif";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "left";

  // Get input values
  const date = document.getElementById("date").value;
  const sources = document.getElementById("sources").value;
  const structures = document.getElementById("structures").value;
  const prompt = document.getElementById("prompt").value;

  const lines = [
    `Date: ${date}`,
    `Sources used: ${sources}`,
    `Structures: ${structures}`,
    `Prompt: ${prompt}`
  ];

  const lineHeight = 40;
  const leftMargin = 30;
  const bottomMargin = 30;

  // Start from bottom, working upward
  let startY = canvas.height - bottomMargin - (lines.length - 1) * lineHeight;

  for (let i = 0; i < lines.length; i++) {
    const y = startY + i * lineHeight;
    ctx.strokeText(lines[i], leftMargin, y);
    ctx.fillText(lines[i], leftMargin, y);
  }
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "modified-image.png";
  link.href = canvas.toDataURL();
  link.click();
}
