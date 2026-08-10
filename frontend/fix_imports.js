const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src/app').filter(f => f.endsWith('.tsx'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.startsWith("import toast from 'react-hot-toast';\n'use client';")) {
    content = content.replace("import toast from 'react-hot-toast';\n'use client';", "'use client';\nimport toast from 'react-hot-toast';");
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  } else if (content.startsWith("import toast from 'react-hot-toast';\n\"use client\";")) {
    content = content.replace("import toast from 'react-hot-toast';\n\"use client\";", "\"use client\";\nimport toast from 'react-hot-toast';");
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}
