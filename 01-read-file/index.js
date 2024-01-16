const path = require('path');
const fs = require('fs');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), {
  encoding: 'UTF-8',
});

stream.on('data', (chunk) => console.log(chunk));
