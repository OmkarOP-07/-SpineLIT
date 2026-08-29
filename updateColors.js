const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/pages/dashboard');

function replaceColors(content) {
  let newContent = content;

  // Background colors
  newContent = newContent.replace(/background:\s*'#F5F0E8'/g, "background: 'var(--bg-warm)'");
  newContent = newContent.replace(/background:\s*'white'/g, "background: 'var(--bg-card)'");
  newContent = newContent.replace(/backgroundColor:\s*'#F5F0E8'/g, "backgroundColor: 'var(--bg-warm)'");
  newContent = newContent.replace(/backgroundColor:\s*'white'/g, "backgroundColor: 'var(--bg-card)'");

  // Borders
  newContent = newContent.replace(/#DFD0B8/g, 'rgba(139, 92, 246, 0.15)');
  newContent = newContent.replace(/#EBE3D5/g, 'rgba(139, 92, 246, 0.15)');

  // Text colors
  newContent = newContent.replace(/color:\s*'#222831'/g, "color: 'var(--text-dark)'");
  newContent = newContent.replace(/color:\s*'#393E46'/g, "color: 'var(--text-dark)'");
  newContent = newContent.replace(/color:\s*'#948979'/g, "color: 'var(--text-muted)'");
  
  // Icon colors
  newContent = newContent.replace(/color="#222831"/g, 'color="var(--text-dark)"');
  newContent = newContent.replace(/color="#393E46"/g, 'color="var(--text-dark)"');
  newContent = newContent.replace(/color="#948979"/g, 'color="var(--text-muted)"');

  // Gradients and active states
  newContent = newContent.replace(/#393E46/g, 'var(--primary)');
  newContent = newContent.replace(/#222831/g, 'var(--primary-dark)');

  // Other F5F0E8 uses like hover states
  newContent = newContent.replace(/'#F5F0E8'/g, "'var(--bg-warm)'");
  newContent = newContent.replace(/'#FFFFFF'/g, "'var(--bg-card)'");

  return newContent;
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const updated = replaceColors(content);
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}

processDirectory(dir);
