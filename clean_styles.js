const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', 'components', 'dashboards');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Clean up overlapping classes
  content = content.replace(/text-xs md:text-sm md:text-sm md:text-base/g, 'text-xs md:text-sm');
  content = content.replace(/text-sm md:text-base md:text-sm/g, 'text-xs md:text-sm');
  content = content.replace(/text-\[10px\] md:text-xs md:text-sm md:text-base/g, 'text-[10px] md:text-xs');
  content = content.replace(/text-\[10px\] md:text-sm md:text-base/g, 'text-[10px] md:text-xs');
  content = content.replace(/text-xs md:text-sm md:text-base/g, 'text-xs md:text-sm');
  content = content.replace(/text-sm md:text-base md:text-base/g, 'text-sm md:text-base');

  fs.writeFileSync(filePath, content);
  console.log(`Cleaned ${file}`);
}
