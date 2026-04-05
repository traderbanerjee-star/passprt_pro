let uploadedImage;
let posX = 50, posY = 50;

document.getElementById("upload").addEventListener("change", (e) => {
  uploadedImage = e.target.files[0];
});

async function processImage() {
  const formData = new FormData();
  formData.append("image", uploadedImage);

  const res = await fetch("http://127.0.0.1:5000/process", {
    method: "POST",
    body: formData
  });

  const blob = await res.blob();
  const img = new Image();
  img.src = URL.createObjectURL(blob);

  img.onload = () => draw(img);
}

function draw(img) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let brightness = document.getElementById("brightness").value;
  let copies = document.getElementById("copies").value;

  canvas.width = 2480;
  canvas.height = 3508;

  ctx.fillStyle = document.getElementById("bgColor").value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.filter = `brightness(${brightness})`;

  let w = 413, h = 531;

  let x = 50, y = 50;

  for (let i = 0; i < copies; i++) {
    ctx.drawImage(img, x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    x += w + 20;

    if (x + w > canvas.width) {
      x = 50;
      y += h + 20;
    }
  }

  // watermark
  ctx.filter = "none";
  ctx.fillStyle = "white";
  ctx.fillText("Developed by Somnath 😎", 20, canvas.height - 20);
}

function download() {
  const link = document.createElement("a");
  link.download = "passport.jpg";
  link.href = document.getElementById("canvas").toDataURL("image/jpeg");
  link.click();
}