const fs = require('fs');
const https = require('https');

const imageUrl = 'https://images.unsplash.com/photo-1506744626753-eda8151a734b?auto=format&fit=crop&w=2000&q=80';
const filePath = 'd:/TRABAJO/aeterna-main/public/bg-landscape.jpg';

https.get(imageUrl, (res) => {
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
