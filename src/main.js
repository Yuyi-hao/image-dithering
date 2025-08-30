import { floydSteinbergDithering } from "./floydSteinbergDithering.js";
import { grayscaled } from "./utils.js";

const imageEle = document.getElementById("org-img");
const canvas = document.getElementById("res-canvas");
const canvasCtx = canvas.getContext('2d');


canvas.width = imageEle.width;
canvas.height = imageEle.height;
canvasCtx.drawImage(imageEle, 0, 0);

const imgData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);

// convert to grayscale
let new_img = floydSteinbergDithering(imgData.data, imgData.width, imgData.height);
new_img = grayscaled(new_img, imgData.width, imgData.height, 4);

const new_img_data = new ImageData(new_img, imgData.width, imgData.height);
canvasCtx.putImageData(new_img_data, 0, 0);