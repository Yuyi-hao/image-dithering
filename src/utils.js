export function grayscaled(imgData, imgWidth, imgHeight, channels=4){
    const grayScaledImg = new Uint8ClampedArray(imgWidth*imgHeight*channels);

    for(let y=0; y < imgHeight; y++){
        for(let x=0; x < imgWidth; x++){
            const idx = (y*imgWidth+x)*channels;
            const old_r = imgData[idx];
            const old_g = imgData[idx+1];
            const old_b = imgData[idx+2];
            
            const grayVal = Math.floor((old_r+old_g+old_b)/3);
            
            grayScaledImg[idx] = grayVal;
            grayScaledImg[idx+1] = grayVal;
            grayScaledImg[idx+2] = grayVal;
            grayScaledImg[idx+3] = imgData[idx+3];

        }
    }

    return grayScaledImg;
}