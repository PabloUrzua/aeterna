const fs = require('fs');
const https = require('https');

const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Misty_Pine_Forest.jpg/1920px-Misty_Pine_Forest.jpg';
const filePath = 'd:/TRABAJO/aeterna-main/public/bg-landscape.jpg';

https.get(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to get image: ${res.statusCode}`);
    return;
  }
  const writeStream = fs.createWriteStream(filePath);
  res.pipe(writeStream);
  writeStream.on('finish', () => {
    writeStream.close();
    console.log('Download Completed to ' + filePath);
  });
}).on('error', (err) => {
  console.error('Error: ', err.message);
});
