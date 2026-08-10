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
let totalModified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Regex to match <button ...> where it does not contain onClick and type="submit"
  // It handles multiline buttons somewhat, but a simpler replace using a replacer function is better.
  
  const buttonRegex = /<button\b([^>]*)>/g;
  content = content.replace(buttonRegex, (match, p1) => {
    if (!p1.includes('onClick') && !p1.includes('type="submit"')) {
      modified = true;
      return `<button onClick={() => toast("Feature coming soon!", { icon: "🚧" })} ${p1}>`;
    }
    return match;
  });

  if (modified) {
    // If not imported, add import
    if (!content.includes("import toast from 'react-hot-toast'") && !content.includes('import toast from "react-hot-toast"')) {
      content = "import toast from 'react-hot-toast';\n" + content;
    }
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    totalModified++;
  }
}

console.log(`Total files updated: ${totalModified}`);
