import fs from 'fs';

const files = [
  'app/page.tsx',
  'app/login/page.tsx',
  'app/dashboard/page.tsx',
  'app/memorial/[slug]/page.tsx'
];

// Beautiful peaceful nature photo with white flowers
const newBg = 'https://picsum.photos/id/93/2000/1200';

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/https:\/\/picsum\.photos\/id\/1018\/2000\/1200/g, newBg);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file} to use Picsum ID 93`);
  }
});
