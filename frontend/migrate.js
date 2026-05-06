const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    content = content.replace(/from '@\//g, "from '");
    content = content.replace(/'use client';(\r?\n)?/g, "");
    
    content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"];?/g, "import { Link } from 'react-router-dom';");
    
    // Convert href to to for Link tags only. This regex is basic but should work for this codebase
    // Wait, href is used for a tags too. Let's just do it for <Link href=
    content = content.replace(/<Link\s+([^>]*)href=/g, "<Link $1to=");
    
    if (content.includes("useRouter, usePathname")) {
        content = content.replace(/import\s+\{\s*useRouter,\s*usePathname\s*\}\s+from\s+['"]next\/navigation['"];?/g, "import { useNavigate, useLocation } from 'react-router-dom';");
    } else {
        content = content.replace(/import\s+\{\s*useRouter\s*\}\s+from\s+['"]next\/navigation['"];?/g, "import { useNavigate } from 'react-router-dom';");
        content = content.replace(/import\s+\{\s*usePathname\s*\}\s+from\s+['"]next\/navigation['"];?/g, "import { useLocation } from 'react-router-dom';");
    }
    
    content = content.replace(/const\s+router\s*=\s*useRouter\(\)/g, "const navigate = useNavigate()");
    content = content.replace(/router\.push/g, "navigate");
    
    content = content.replace(/const\s+pathname\s*=\s*usePathname\(\)/g, "const location = useLocation();\n  const pathname = location.pathname");

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Modified:', filePath);
    }
  }
});
