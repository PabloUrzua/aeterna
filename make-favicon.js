const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, 'public', 'logo.png');
const output = path.join(__dirname, 'public', 'favicon.png'); // Guardamos un nuevo favicon.png

async function processImage() {
  try {
    const metadata = await sharp(input).metadata();
    const size = Math.min(metadata.width, metadata.height);
    
    // Zoom/scale: crop a square from the center. 1.25 scale (to not cut too much)
    const cropSize = Math.floor(size / 1.25);
    
    // Create an SVG circle mask
    const circleSvg = `<svg width="${cropSize}" height="${cropSize}">
      <circle cx="${cropSize/2}" cy="${cropSize/2}" r="${cropSize/2}" fill="white" />
    </svg>`;

    await sharp(input)
      .extract({
        left: Math.floor((metadata.width - cropSize) / 2),
        top: Math.floor((metadata.height - cropSize) / 2),
        width: cropSize,
        height: cropSize
      })
      .composite([{
        input: Buffer.from(circleSvg),
        blend: 'dest-in'
      }])
      .png()
      .toFile(output);
      
    console.log('Circular favicon created successfully at ' + output);
  } catch (error) {
    console.error('Error creating circular favicon:', error);
  }
}

processImage();
