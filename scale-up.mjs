import fs from 'fs';

const files = [
  'app/dashboard/page.tsx',
  'app/memorial/[slug]/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Scale up layout containers for better desktop utilization
  content = content.replace(/max-w-5xl/g, 'max-w-7xl');
  content = content.replace(/max-w-4xl/g, 'max-w-6xl');
  
  // Enlarge base paddings for a more premium, breathable look
  content = content.replace(/\bp-4\b/g, 'p-5');
  content = content.replace(/\bp-6\b/g, 'p-8');
  content = content.replace(/\bpy-8\b/g, 'py-12');
  content = content.replace(/\bpx-6\b/g, 'px-8');
  
  // Scale text sizes
  content = content.replace(/\btext-sm\b/g, 'text-base');
  content = content.replace(/\btext-xs\b/g, 'text-sm');
  
  // Give inputs and buttons more breathing room
  content = content.replace(/\bpy-2\b/g, 'py-3');
  
  fs.writeFileSync(file, content);
  console.log(`Scaled up layout for ${file}`);
});
