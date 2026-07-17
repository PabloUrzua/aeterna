import fs from 'fs';

const files = [
  'app/dashboard/page.tsx',
  'app/memorial/[slug]/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Clean up all dark: classes since we don't use them anymore
  content = content.replace(/\bdark:[a-zA-Z0-9-/[\]#]+(?:\/[0-9]+)?\b\s?/g, '');
  
  // Replace text colors
  content = content.replace(/\btext-neutral-950\b/g, 'text-[#111111]');
  content = content.replace(/\btext-neutral-900\b/g, 'text-[#111111]');
  content = content.replace(/\btext-neutral-800\b/g, 'text-[#111111]');
  content = content.replace(/\btext-stone-900\b/g, 'text-[#111111]');
  
  // Lighten the muted texts slightly for warmth
  content = content.replace(/\btext-neutral-400\b/g, 'text-neutral-500');
  
  // Replace backgrounds
  content = content.replace(/\bbg-neutral-900\b/g, 'bg-[#111111]');
  content = content.replace(/\bhover:bg-neutral-800\b/g, 'hover:bg-[#2C2926]');
  content = content.replace(/\bbg-neutral-950\b/g, 'bg-white/60');
  
  // Replace borders
  content = content.replace(/\bborder-neutral-950\b/g, 'border-[#111111]');
  
  // Inputs
  content = content.replace(/\bfocus:border-neutral-500\b/g, 'focus:border-[#967B62]');
  
  // Ensure cards have glass effect
  content = content.replace(/\bbg-white border border-stone-200\/60\b/g, 'bg-white/80 backdrop-blur-md border border-stone-200/60');

  fs.writeFileSync(file, content);
  console.log(`Updated colors in ${file}`);
});
