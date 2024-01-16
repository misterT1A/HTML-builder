const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.readdir(__dirname, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.isDirectory()) {
      const dir = path.resolve(__dirname, file.name);

      fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach((elem) => {
          if (elem.isFile()) {
            const pathFile = path.join(dir, elem.name);
            fs.stat(pathFile, (err, stats) => {
              if (err) throw err;

              const message = [];

              const name = path.parse(elem.name).name;
              message.push(`${name}`);

              const extName = path.extname(elem.name).slice(1);
              message.push(`${extName}`);

              const size = stats.size / 1000;
              message.push(`${size}kb`);

              stdout.write(message.join(' - ') + '\n');
            });
          }
        });
      });
    }
  });
});
