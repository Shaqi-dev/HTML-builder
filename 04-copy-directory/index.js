const path = require('path');
const { readdir, copyFile, rm, mkdir } = require('fs/promises');

const dirMain = path.join(__dirname, 'files');
const dirCopy = path.join(__dirname, 'files-copy');

async function copyDir(main, copy) {
  await rm(copy, { recursive: true, force: true });
  await mkdir(copy);

  await readdir(main)
    .then(files => {
      files.forEach(file => copyFile(path.join(main, file), path.join(copy, file)));
    });
}

copyDir(dirMain, dirCopy);