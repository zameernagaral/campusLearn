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
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const buttonRegex = /<button[^>]*>/g;
    let match;
    while ((match = buttonRegex.exec(line)) !== null) {
      const attr = match[0];
      if (!attr.includes('onClick') && !attr.includes('type="submit"')) {
         console.log(`${file}:${i+1} -> ${attr}`);
      }
    }
  }
}
