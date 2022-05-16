const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(file);
const { stdin, stdout, } = process;

stdout.write('Hello! Please enter your text.\n' + 'To exit press Ctrl + C or type: "exit".\n');

stdin.on('data', chunk => {
  if (chunk.toString().toLowerCase().trim() === 'exit') {
    process.exit();
  } else {
    output.write(chunk);
  }
});
stdin.on('error', error => console.log('Error', error.message));

process.on('exit', () => stdout.write('Done!'));
process.on('SIGINT', process.exit);
