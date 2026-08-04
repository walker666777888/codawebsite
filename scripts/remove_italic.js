const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        results = results.concat(walk(fullPath));
      }
    } else {
      if (fullPath.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
  });
  return results;
};

const files = walk('c:/Users/walke/citizenofdigitalage-browserOS/components');
let changedCount = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Repeatedly replace 'italic' inside className="" or className={""} strings
  let matched = true;
  while(matched) {
    const prev = content;
    // This regex looks for className= followed by string quotes or {` `} and removes 'italic'
    content = content.replace(/(className=(?:\{?["'`]|(?:\[)?["'`]))([^"'`]*?)\bitalic\b([^"'`]*?["'`]\}?)/g, "$1$2$3");
    if (prev === content) matched = false;
  }

  // Clean up double spaces in class names
  content = content.replace(/(className=(?:\{?["'`]|(?:\[)?["'`]))([^"'`]*?)(["'`]\}?)/g, (match, p1, p2, p3) => {
    return p1 + p2.replace(/\s+/g, ' ').trim() + p3;
  });

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
    changedCount++;
  }
});
console.log(`Changed ${changedCount} files.`);
