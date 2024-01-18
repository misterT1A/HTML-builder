const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const distPath = path.resolve(__dirname, 'project-dist');
const bundleCssPath = path.resolve(__dirname, 'project-dist', 'style.css');
const folderStylesPath = path.resolve(__dirname, 'styles');

const targetFolderAssets = path.resolve(__dirname, 'assets');
const copyFolderAssets = path.resolve(__dirname, 'project-dist', 'assets');

const templateHtml = path.resolve(__dirname, 'template.html');
const componentsFolder = path.resolve(__dirname, 'components');
const indexHtml = path.resolve(__dirname, 'project-dist', 'index.html');

const buildCss = () => {
  fs.mkdir(distPath, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(folderStylesPath, { recursive: true }, (err, files) => {
      if (err) throw err;

      const dataArr = [];

      files.forEach((file) => {
        const filePath = path.resolve(folderStylesPath, file);
        const extFile = path.parse(filePath).ext;

        if (extFile === '.css') {
          const prom = fsPromises.readFile(filePath);
          dataArr.push(prom);
        }
      });
      Promise.all(dataArr).then((file) => {
        fsPromises.writeFile(bundleCssPath, file);
      });
    });
  });
};

const copyAssets = (target, copy) => {
  fs.rm(copyFolderAssets, { recursive: true, force: true }, (err) => {
    if (err) throw err;

    fs.mkdir(copy, { recursive: true }, (err) => {
      if (err) throw err;

      fs.readdir(target, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
          if (file.isDirectory()) {
            const newTarget = path.resolve(target, file.name);
            const newCopy = path.resolve(copy, file.name);

            copyAssets(newTarget, newCopy);
          } else {
            const targetFile = path.resolve(target, file.name);

            const newFile = path.resolve(copy, file.name);

            fs.copyFile(targetFile, newFile, (err) => {
              if (err) throw err;
            });
          }
        });
      });
    });
  });
};

const buildHTML = () => {
  fs.copyFile(templateHtml, indexHtml, (err) => {
    if (err) throw err;

    fs.readFile(indexHtml, 'utf-8', (err, file) => {
      if (err) throw err;

      const prom = [];

      fsPromises
        .readdir(componentsFolder, { withFileTypes: true })
        .then((components) => {
          components.forEach((component) => {
            const name = path.parse(component.name).name;
            const componentPath = path.resolve(
              componentsFolder,
              component.name,
            );
            prom.push(
              fsPromises.readFile(componentPath, 'utf-8').then((content) => {
                file = file.replaceAll(`{{${name}}}`, content);
              }),
            );
          });

          Promise.all(prom).then(() => fsPromises.writeFile(indexHtml, file));
        });
    });
  });
};

(() => {
  buildCss();
  copyAssets(targetFolderAssets, copyFolderAssets);
  buildHTML();
})();
