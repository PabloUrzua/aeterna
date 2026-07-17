import fs from 'fs';

const files = [
  'app/page.tsx',
  'app/login/page.tsx',
  'app/dashboard/page.tsx',
  'app/memorial/[slug]/page.tsx'
];

// Beautiful landscape photo from Picsum that won't be blocked by Unsplash hotlink protections
const newBg = 'https://picsum.photos/id/1018/2000/1200';

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace either the unsplash URL or the local path if it was changed
    content = content.replace(/\/bg-landscape\.jpg/g, newBg);
    content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[^"']+/g, newBg);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file} to use Picsum background`);
  }
});
