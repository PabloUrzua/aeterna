import fs from 'fs';

const files = [
  'app/login/page.tsx',
  'app/dashboard/page.tsx',
  'app/memorial/[slug]/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Fix Login Box Size
  if (file.includes('login/page')) {
    content = content.replace(/max-w-sm/g, 'max-w-md');
    // Color icons
    content = content.replace(/text-neutral-400/g, 'text-[#967B62]');
  }

  // General Text Sizing Upscales
  content = content.replace(/text-\[8px\]/g, 'text-[10px]');
  content = content.replace(/text-\[9px\]/g, 'text-xs');
  content = content.replace(/text-\[10px\]/g, 'text-sm');
  content = content.replace(/text-\[11px\]/g, 'text-sm');
  
  // Specific input text sizing
  content = content.replace(/text-xs text-\[#111111\]/g, 'text-sm text-[#111111]');

  // Replace black buttons with the accent color #967B62
  // But preserve the main text (#111111) 
  content = content.replace(/bg-\[#111111\]/g, 'bg-[#967B62]');
  content = content.replace(/hover:bg-\[#2C2926\]/g, 'hover:bg-[#7D654E]');
  content = content.replace(/border-\[#111111\]/g, 'border-[#967B62]');

  fs.writeFileSync(file, content);
  console.log(`Updated sizes and colors in ${file}`);
});
