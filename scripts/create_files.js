import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// 1. Define target directory and the source list file
const TARGET_DIR = 'cypress/fixtures/'; // Saves to an 'output' folder
const LIST_FILE = 'directories_path.txt';

// 2. Create the target directory if it doesn't exist
if (!existsSync(TARGET_DIR)) {
  mkdirSync(TARGET_DIR, { recursive: true });
}

// 3. Read the text file, split by lines, and create files
try {
  const data = readFileSync(LIST_FILE, 'utf8');
  const names = data.split(/\r?\n/).filter(name => name.trim() !== '');

  names.forEach(name => {
    const filePath = join(TARGET_DIR, `${name}`);

    mkdirSync(filePath, { recursive: true }); // Creates an empty file
    console.log(`Created: ${filePath}`);
  });

  console.log('🎉 All files created successfully!');
} catch (err) {
  console.error('Error reading the names file:', err.message);
}