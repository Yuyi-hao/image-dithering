const imageEle = document.getElementById("org-img");
const canvas = document.getElementById("res-canvas");
const canvasCtx = canvas.getContext('2d');


canvas.width = imageEle.width;
canvas.height = imageEle.height;
canvasCtx.drawImage(imageEle, 0, 0);

const imgData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);

// convert to grayscale
const new_img = new Uint8ClampedArray(imgData.width*imgData.height*4);


const diffuse = (imgData, x, y, dx, dy, error, weight) => {
    const ni = ((y + dy) * imgData.width + (x + dx)) * 4;
    const val = Math.floor(
    (imgData.data[ni] + imgData.data[ni + 1] + imgData.data[ni + 2]) / 3
    ) + error * weight;

    imgData.data[ni]     = val;
    imgData.data[ni + 1] = val;
    imgData.data[ni + 2] = val;
}


for (let y = 0; y < imgData.height - 1; y++) {
  for (let x = 1; x < imgData.width - 1; x++) {
    const index = (y * imgData.width + x) * 4;

    // Convert pixel to grayscale first
    const oldGray = Math.floor(
      (imgData.data[index] +
       imgData.data[index + 1] +
       imgData.data[index + 2]) / 3
    );

    // quantize to N levels
    const factor = 1; // try 3 for 4 levels, 7 for 8 levels, 1 for pure B/W
    const newGray = Math.round((factor * oldGray) / 255) * (255 / factor);

    const error = oldGray - newGray;

    // set pixel
    new_img[index]     = newGray;
    new_img[index + 1] = newGray;
    new_img[index + 2] = newGray;
    new_img[index + 3] = imgData.data[index + 3]; // alpha

    diffuse(imgData, x, y, 1, 0,  error, 7 / 16);   // right
    diffuse(imgData, x, y, -1, 1, error,  3 / 16);  // bottom-left
    diffuse(imgData, x, y, 0, 1,  error, 5 / 16);   // bottom
    diffuse(imgData, x, y, 1, 1,  error, 1 / 16);   // bottom-right
  }
}
const new_img_data = new ImageData(new_img, imgData.width, imgData.height);
canvasCtx.putImageData(new_img_data, 0, 0);