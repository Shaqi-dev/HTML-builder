const path = require('path');
const { readdir, copyFile, rm, mkdir } = require('fs/promises');
const { createReadStream, createWriteStream, readFile } = require('fs');

class Build {
  constructor(assets, styles, components, template) {
    this._basePath = path.join(__dirname);
    this._distPath = path.join(__dirname, 'project-dist');
    this.assets = assets;
    this.styles = styles;
    this.components = components;
    this.template = template;
    this.runBuild();
  } 

  async runBuild() {
    await this.createDir(this._distPath);
    this.copyDir(this.assets);
    this.bundleStyles('styles', 'styles.css');
    this.bundleHTML();
  }
 
  async createDir(path) {
    await rm(path, { recursive: true, force: true });
    await mkdir(path);
  }

  async copyDir(folderName) {
    const base = path.join(this._basePath, folderName);
    const dist = path.join(this._distPath, folderName);
    
    await this.createDir(dist);

    const files = await readdir(base, { withFileTypes: true });
    files.forEach(file => {
      const currentName = path.join(folderName, file.name);
      if (file.isDirectory()) {
        this.copyDir(currentName);
      } else {
        const currentBase = path.join(base, file.name);
        const currentDist = path.join(dist, file.name);
        copyFile(currentBase, currentDist);
      }
    });
  }

  async bundleStyles() {
    const stylesPath = path.join(this._basePath, this.styles);
    const bundlePath = path.join(this._distPath, 'style.css');

    await rm(bundlePath, { force: true });
    const CSSFiles =  (await readdir(stylesPath)).filter(file => path.extname(path.join(stylesPath, file)) === '.css');
    CSSFiles.forEach(file => {
      const currentPath = path.join(stylesPath, file);
      const readStream = createReadStream(currentPath, 'utf-8');
      const writeStream = createWriteStream(bundlePath, { flags: 'a' });
      readStream.pipe(writeStream);
    });
  }

  async bundleHTML() {
    const componentsPath = path.join(this._basePath, this.components);
    const templatePath = path.join(this._basePath, this.template);
    const bundlePath = path.join(this._distPath, 'index.html');
    const components = (await readdir(componentsPath)).filter(file => path.extname(path.join(componentsPath, file)) === '.html');
    
    readFile(templatePath, { encoding: 'utf8' }, (err, templateData) => {
      if (err) throw err;

      let html = templateData;

      components.forEach((file, i) => {
        const name = file.split('.')[0];
        const filePath = path.join(this._basePath, this.components, file);
        readFile(filePath, { encoding: 'utf8' }, (err, fileData) => {
          if (err) throw err;

          html = html.replace(`{{${name}}}`, fileData);

          if (i === components.length - 1) {
            const writeStream = createWriteStream(bundlePath);
            writeStream.write(html);
          }
        }); 
      });
    });
  }
}

new Build('assets', 'styles', 'components', 'template.html');
