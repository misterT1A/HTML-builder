const { stdin, stdout } = process;
const fs = require('fs');
const readLine = require('readline');
const path = require('path');

const rl = readLine.createInterface({
  input: stdin,
  output: stdout,
});

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Write some text: \n');

rl.on('line', (answer) => {
  if (answer === 'exit') {
    stdout.write('Good luck');
    process.exit();
  }
  stream.write(answer + '\n');
});

rl.on('SIGINT', () => {
  stdout.write('Good luck');
  process.exit();
});
