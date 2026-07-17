const fs = require('fs');
const path = require('path');

const dir = 'd:/TRABAJO/aeterna-main/public';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function download() {
  try {
    const res = await fetch('https://images.unsplash.com/photo-1506744626753-eda8151a734b?auto=format&fit=crop&w=2000&q=80');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(path.join(dir, 'bg-landscape.jpg'), Buffer.from(buffer));
    console.log('Downloaded successfully');
  } catch (e) {
    console.error('Error downloading:', e);
  }
}
download();
