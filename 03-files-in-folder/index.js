const { stat } = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');

const files = readdir(folder, { withFileTypes: true });
files.then(data => data.forEach(file => {
  const currentPath = path.join(folder, file.name);

  if (file.isFile()) {
    const name = file.name.split('.')[0] || '(File name doesn\'t exist)';
    const ext = path.extname(currentPath).slice(1) || file.name.split('.')[1];
    stat(currentPath, (err, stats) => {
      if (err) {
        return 'File doesn\'t exist.';
      } else {
        const size = (stats.size / 1024).toFixed(3) + 'kb';
        return console.log(`${name} - ${ext} - ${size}`);
      }
    });
  }
}));





