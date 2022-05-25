const { createReadStream, createWriteStream } = require('fs');
const { rm, readdir } = require('fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleStyles(styles, bundle) {
  await rm(bundle, { force: true });
  const writeStream = createWriteStream(bundle, { flags: 'a' });
  const CSSFiles =  (await readdir(styles)).filter(file => path.extname(path.join(styles, file)) === '.css');
  CSSFiles.forEach(file => {
    const data = [];
    const currentPath = path.join(styles, file);
    const readStream = createReadStream(currentPath, 'utf-8');
    readStream.on('data', chunk => data.push(chunk));
    readStream.on('end', () => data.forEach(item => writeStream.write(`${item}\n`)));
    readStream.on('error', err => console.log('Error: ', err.message));
  });
}

bundleStyles(stylesPath, bundlePath);