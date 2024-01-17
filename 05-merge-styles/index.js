const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const folderPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');

fs.readdir(folderPath, { recursive: true }, (err, files) => {
  if (err) throw err;

  const dataArr = [];

  files.forEach((file) => {
    const filePath = path.resolve(folderPath, file);
    const extFile = path.parse(filePath).ext;

    if (extFile === '.css') {
      const prom = fsPromises.readFile(filePath);
      dataArr.push(prom);
    }
  });
  Promise.all(dataArr).then((file) => {
    fsPromises.writeFile(bundlePath, file);
  });
});
