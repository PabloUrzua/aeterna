const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'components', 'dashboards');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace font sizes
  content = content.replace(/text-\[9px\]/g, 'text-[10px] md:text-xs');
  content = content.replace(/text-\[10px\]/g, 'text-xs md:text-sm');
  content = content.replace(/text-\[11px\]/g, 'text-sm');
  
  // Base text sizing on root container
  content = content.replace(/text-xs(?!\s*md:)/g, 'text-sm md:text-base');

  // Fix grid padding
  content = content.replace(/px-6 py-8/g, 'px-4 py-6 md:px-6 md:py-8');
  content = content.replace(/p-6/g, 'p-4 md:p-6');
  content = content.replace(/p-8/g, 'p-5 md:p-8');
  content = content.replace(/px-8/g, 'px-4 md:px-8');

  // Add overflow-x-auto to table wrappers where possible
  // We can look for `<table` and inject a wrapper, but it's easier to find `<div className="overflow-x-auto">` if it doesn't exist.
  // Actually, let's just make the entire grid stack on mobile.
  // "grid lg:grid-cols-4" already stacks on mobile. But "flex justify-between" might break.
  // Let's replace "flex justify-between items-center" with "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0" for headers.
  content = content.replace(/flex justify-between items-center/g, 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
