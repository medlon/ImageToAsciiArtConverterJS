const fs = require('fs');
const PNG = require('pngjs').PNG;
const sharp = require('sharp');  

//--------------------------------------------------------------------------------
const imageName = 'pepe6.png';                            //File name of the image to load
const nameOfGreyScaleImg = 'pepe6ResizedGREYSCALE.png';
const resizeWidth = 200;
let imageData; 

try {
    async function oaoa(){                              //'resize', 'greyscale', 'toFile' of the sharp package are async methods
      imageData = fs.readFileSync(imageName);
      await sharp(imageData).resize({width: resizeWidth}).greyscale().toFile(nameOfGreyScaleImg);
        //Dont have to specify 'height' or resized image or aspect ratio. 'sharp' does it by itself
    }
    oaoa();
  } catch(error) {
    console.log(`Error while resizing or greyscaling image: ${error}`);
  }
//--------------------------------------------------------------------------------

const delay = 1000;
const start = Date.now();

while (Date.now() - start < delay) {}       //Add a delay in order to give the file time to be created. Im bored to implement promises logic


let asciiArtArray = [];

function getAsciiChar(grayValue) {
    const asciiChars = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'';
    const index = Math.floor((grayValue / 255) * (asciiChars.length - 1));          //'Math.floor' rounds down (or toward 0 (up) for negatives)
    asciiArtArray.push(asciiChars[index]);
}

try {
    const filePath = nameOfGreyScaleImg;
    const fileData = fs.readFileSync(filePath);
    const png = PNG.sync.read(fileData);

    const width = png.width;
    const height = png.height;

    for (let y = 0; y < height; y++) {
        if (y !== 0) {
            asciiArtArray.push("\n");
        }
        for (let x = 0; x < width; x++) {
            const idx = (width * y + x) << 2;           // Each pixel consists of 4 bytes (RGBA)       
            // "<<" bitwise left shift. Multiplies the calculated index by 4.
            //Each pixel in PNG format typically consists of 4 components: RGBA --> each occupying 1 byte (8 bits) -->
            //Multiplying the index by 4 gives the starting position of the pixel in the image data array.
            const red = png.data[idx];              //Since the image is already greyscaled --> Red will be = to Green = to BLUE
            // const green = png.data[idx + 1]; // Green component (0-255)
            // const blue = png.data[idx + 2];  // Blue component (0-255)
            // const alpha = png.data[idx + 3]; // Alpha component (0-255)
            getAsciiChar(red);
        }
    }

    console.log(asciiArtArray.join(''));
} catch (err) {
    console.error('Error:', err);
}
fs.appendFileSync('outputAsciiArt.txt', asciiArtArray.join(''));    //create the output .txt
if (fs.existsSync(nameOfGreyScaleImg)) {                                     //delete the greyscaled/resized image that was created out of the original
    fs.unlinkSync(nameOfGreyScaleImg); }