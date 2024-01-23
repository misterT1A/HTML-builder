const fs = require('fs');
const path = require('path');

const copyDir = () => {
  const targetFolderPath = path.resolve(__dirname, 'files');
  const newFolderPath = path.resolve(__dirname, 'files-copy');

  fs.mkdir(newFolderPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(newFolderPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const pathFile = path.resolve(newFolderPath, file);

      fs.unlink(pathFile, (err) => {
        if (err) throw err;
      });
    });

    fs.readdir(targetFolderPath, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const targetFile = path.resolve(targetFolderPath, file);
        const newFile = path.resolve(newFolderPath, file);

        fs.copyFile(targetFile, newFile, (err) => {
          if (err) throw err;
        });
      });
    });
  });
};

copyDir();
