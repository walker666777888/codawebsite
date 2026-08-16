const fs = require('fs');
let content = fs.readFileSync('c:/Users/walke/citizenofdigitalage-browserOS/components/sections/CallToAction.tsx', 'utf8');

content = content.replace(/import Galaxy from "@\/components\/ui\/Galaxy";\n/, '');

content = content.replace(/\{\/\* Galaxy Background for the whole section \*\/\}\s*<Galaxy[\s\S]*?transparent=\{false\}\s*\/>/, '{/* Galaxy removed for performance */}');

fs.writeFileSync('c:/Users/walke/citizenofdigitalage-browserOS/components/sections/CallToAction.tsx', content, 'utf8');
console.log("Galaxy removed safely.");
