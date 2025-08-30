const diffuse = (imgData, imgWidth, x, y, dx, dy, error, weight, channel) => {
    const ni = ((y + dy) * imgWidth + (x + dx)) * 4;
    imgData[ni+channel] = imgData[ni+channel]+error*weight;
}

export function floydSteinbergDithering(imgData, imgWidth, imgHeight, channels=4, factor=1){
    const new_img  = new Uint8ClampedArray(imgWidth*imgHeight*channels);

    for (let y = 0; y < imgHeight - 1; y++) {
        for (let x = 1; x < imgWidth - 1; x++) {
            const index = (y * imgWidth + x) * 4;


            for(let c=0; c<3; c++){

                // const oldGray = Math.floor(
                // (imgData[index]*0.299 +
                //     imgData[index + 1]*0.587 +
                //     imgData[index + 2]*0.114)
                // );

                // Convert pixel to grayscale first
                const oldVal = imgData[index+c];

                // quantize to N levels
                const newVal = Math.round((factor * oldVal) / 255) * (255 / factor);
                // const newGray = Math.round((factor * oldGray) / 255) * (255 / factor);
                
                const error = oldVal - newVal;
                // const error = oldGray - newGray;

                new_img[index+c] = newVal;
                // new_img[index+c] = newGray;

                // diffuse error to neighbors
                diffuse(imgData, imgWidth ,x, y, 1, 0,  error, 7 / 16, c);   // right
                diffuse(imgData, imgWidth ,x, y, -1, 1, error,  3 / 16, c);  // bottom-left
                diffuse(imgData, imgWidth ,x, y, 0, 1,  error, 5 / 16, c);   // bottom
                diffuse(imgData, imgWidth ,x, y, 1, 1,  error, 1 / 16, c);   // bottom-right
            }
            new_img[index + 3] = imgData[index + 3]; // alpha
        }
    }

    return new_img;
}