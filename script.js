let net;

// Load the BodyPix model
async function loadModel() {
  net = await bodyPix.load();
  console.log("BodyPix model loaded!");
}

loadModel();

// Handle background removal
const removeBtn = document.getElementById('removeBackgroundBtn');
removeBtn.addEventListener('click', async () => {
  const fileInput = document.getElementById('imageUpload').files[0];
  if (!fileInput) return alert("Please upload an image!");

  const img = new Image();
  img.src = URL.createObjectURL(fileInput);

  img.onload = async () => {
    const canvas = document.getElementById('outputCanvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const segmentation = await net.segmentPerson(canvas);
    const mask = bodyPix.toMask(segmentation);

    bodyPix.drawMask(canvas, img, mask, 0.7, 5, false);
  };
});

// Handle image download
const downloadBtn = document.getElementById('downloadBtn');
downloadBtn.addEventListener('click', () => {
  const canvas = document.getElementById('outputCanvas');
  const link = document.createElement('a');
  link.download = 'no-background.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("Service Worker registration failed", err));
}
