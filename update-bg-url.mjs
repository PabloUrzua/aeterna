import fs from 'fs';

const files = [
  'app/page.tsx',
  'app/login/page.tsx',
  'app/dashboard/page.tsx',
  'app/memorial/[slug]/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1506744626753-eda8151a734b\?[^"']+/g, '/bg-landscape.jpg');
    // For landing page, let's also remove the Next.js eslint disable comment if it's there
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
